#!/usr/bin/env node

/**
 * 自动快照钩子 - 在文件操作前自动触发
 * 这个脚本会被 AI 在执行文件修改操作前自动调用
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_META_FILE = '.opencode/.snapshots.json';
const AUTO_SNAPSHOT_INTERVAL = 5 * 60 * 1000; // 5分钟内不重复创建快照

/**
 * 执行命令并返回输出
 */
function exec(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * 读取快照元数据
 */
function readSnapshots() {
  if (!fs.existsSync(SNAPSHOT_META_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT_META_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

/**
 * 保存快照元数据
 */
function saveSnapshots(snapshots) {
  const dir = path.dirname(SNAPSHOT_META_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SNAPSHOT_META_FILE, JSON.stringify(snapshots, null, 2));
}

/**
 * 检查是否需要创建快照
 */
function shouldCreateSnapshot() {
  const snapshots = readSnapshots();
  
  // 如果没有快照，需要创建
  if (snapshots.length === 0) {
    return true;
  }
  
  // 检查最近的快照时间
  const lastSnapshot = snapshots[0];
  const lastTime = new Date(lastSnapshot.timestamp).getTime();
  const now = Date.now();
  
  // 如果距离上次快照超过设定时间，需要创建新快照
  return (now - lastTime) > AUTO_SNAPSHOT_INTERVAL;
}

/**
 * 自动创建快照
 */
function autoSnapshot(operation = '文件操作') {
  // 检查是否在 Git 仓库中
  const isGitRepo = exec('git rev-parse --git-dir');
  if (!isGitRepo) {
    console.log('⚠️  不在 Git 仓库中，跳过快照');
    return false;
  }
  
  // 检查是否需要创建快照
  if (!shouldCreateSnapshot()) {
    console.log('✓ 使用最近的快照（5分钟内已创建）');
    return true;
  }
  
  // 检查是否有未提交的更改
  const status = exec('git status --porcelain');
  if (!status) {
    console.log('✓ 工作区干净，无需快照');
    return true;
  }
  
  const timestamp = new Date().toISOString();
  const message = `[Auto] ${operation} - ${timestamp}`;
  
  console.log('🔒 自动创建安全快照...');
  
  try {
    // 创建 stash
    exec(`git stash push -u -m "${message}"`);
    
    // 获取 stash ID
    const stashList = exec('git stash list');
    if (!stashList) {
      console.log('⚠️  快照创建失败');
      return false;
    }
    
    const match = stashList.split('\n')[0].match(/stash@\{(\d+)\}/);
    if (!match) {
      console.log('⚠️  无法获取快照 ID');
      return false;
    }
    
    const stashId = match[1];
    
    // 保存元数据
    const snapshots = readSnapshots();
    const snapshot = {
      id: stashId,
      description: `自动快照: ${operation}`,
      timestamp,
      message,
      auto: true
    };
    snapshots.unshift(snapshot);
    
    // 只保留最近 10 个自动快照
    const filtered = snapshots.slice(0, 10);
    saveSnapshots(filtered);
    
    console.log(`✓ 快照已创建 [stash@{${stashId}}]`);
    return true;
  } catch (error) {
    console.log('⚠️  快照创建失败:', error.message);
    return false;
  }
}

// 获取操作描述
const operation = process.argv[2] || '文件操作';

// 执行自动快照
const success = autoSnapshot(operation);

// 返回状态码
process.exit(success ? 0 : 1);
