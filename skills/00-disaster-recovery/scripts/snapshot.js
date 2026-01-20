#!/usr/bin/env node

/**
 * 容灾备份系统 - 快照管理脚本
 * 提供自动备份和快速恢复功能
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 快照元数据存储路径
const SNAPSHOT_META_FILE = '.opencode/.snapshots.json';

/**
 * 执行命令并返回输出
 */
function exec(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch (error) {
    throw new Error(`命令执行失败: ${command}\n${error.message}`);
  }
}

/**
 * 读取快照元数据
 */
function readSnapshots() {
  if (!fs.existsSync(SNAPSHOT_META_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(SNAPSHOT_META_FILE, 'utf-8'));
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
 * 创建快照
 */
function createSnapshot(description = '自动备份') {
  const timestamp = new Date().toISOString();
  const message = `[Snapshot] ${description} - ${timestamp}`;
  
  console.log('🔄 正在创建快照...');
  
  // 检查是否有未提交的更改
  const status = exec('git status --porcelain');
  if (!status) {
    console.log('✅ 工作区干净，无需备份');
    return null;
  }
  
  // 创建 stash
  const stashMessage = exec(`git stash push -u -m "${message}"`);
  
  // 获取 stash ID
  const stashList = exec('git stash list');
  const stashId = stashList.split('\n')[0].match(/stash@\{(\d+)\}/)[1];
  
  // 保存元数据
  const snapshots = readSnapshots();
  const snapshot = {
    id: stashId,
    description,
    timestamp,
    message
  };
  snapshots.unshift(snapshot);
  saveSnapshots(snapshots);
  
  console.log(`✅ 快照创建成功: ${description}`);
  console.log(`   ID: stash@{${stashId}}`);
  console.log(`   时间: ${timestamp}`);
  
  return snapshot;
}

/**
 * 列出所有快照
 */
function listSnapshots() {
  const snapshots = readSnapshots();
  
  if (snapshots.length === 0) {
    console.log('📭 暂无快照');
    return;
  }
  
  console.log('📋 可用快照列表:\n');
  snapshots.forEach((snapshot, index) => {
    console.log(`${index + 1}. [stash@{${snapshot.id}}]`);
    console.log(`   描述: ${snapshot.description}`);
    console.log(`   时间: ${snapshot.timestamp}`);
    console.log('');
  });
}

/**
 * 恢复快照
 */
function restoreSnapshot(stashId) {
  console.log(`🔄 正在恢复快照 stash@{${stashId}}...`);
  
  try {
    exec(`git stash apply stash@{${stashId}}`);
    console.log('✅ 快照恢复成功');
  } catch (error) {
    console.error('❌ 恢复失败:', error.message);
    throw error;
  }
}

/**
 * 硬回滚（恢复并删除快照）
 */
function hardRollback(stashId) {
  console.log(`⚠️  正在执行硬回滚 stash@{${stashId}}...`);
  
  try {
    exec(`git stash pop stash@{${stashId}}`);
    
    // 更新元数据
    const snapshots = readSnapshots();
    const filtered = snapshots.filter(s => s.id !== stashId);
    saveSnapshots(filtered);
    
    console.log('✅ 硬回滚成功');
  } catch (error) {
    console.error('❌ 回滚失败:', error.message);
    throw error;
  }
}

/**
 * 删除快照
 */
function deleteSnapshot(stashId) {
  console.log(`🗑️  正在删除快照 stash@{${stashId}}...`);
  
  try {
    exec(`git stash drop stash@{${stashId}}`);
    
    // 更新元数据
    const snapshots = readSnapshots();
    const filtered = snapshots.filter(s => s.id !== stashId);
    saveSnapshots(filtered);
    
    console.log('✅ 快照已删除');
  } catch (error) {
    console.error('❌ 删除失败:', error.message);
    throw error;
  }
}

// CLI 接口
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'create':
    createSnapshot(arg || '手动备份');
    break;
  case 'list':
    listSnapshots();
    break;
  case 'restore':
    if (!arg) {
      console.error('❌ 请指定快照 ID');
      process.exit(1);
    }
    restoreSnapshot(arg);
    break;
  case 'rollback':
    if (!arg) {
      console.error('❌ 请指定快照 ID');
      process.exit(1);
    }
    hardRollback(arg);
    break;
  case 'delete':
    if (!arg) {
      console.error('❌ 请指定快照 ID');
      process.exit(1);
    }
    deleteSnapshot(arg);
    break;
  default:
    console.log(`
容灾备份系统 - 快照管理工具

用法:
  node snapshot.js create [描述]     创建快照
  node snapshot.js list              列出所有快照
  node snapshot.js restore <ID>      恢复快照（保留快照）
  node snapshot.js rollback <ID>     硬回滚（删除快照）
  node snapshot.js delete <ID>       删除快照

示例:
  node snapshot.js create "重构前备份"
  node snapshot.js restore 0
  node snapshot.js rollback 0
    `);
}
