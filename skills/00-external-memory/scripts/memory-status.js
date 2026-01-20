#!/usr/bin/env node

/**
 * External Memory System - Status Check Script
 * 外部记忆系统 - 状态检查脚本
 * 
 * Displays current memory system status
 * 显示当前记忆系统状态
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = '.memory';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  dim: '\x1b[2m'
};

/**
 * Check if memory system is initialized
 * 检查记忆系统是否已初始化
 */
function isInitialized() {
  return fs.existsSync(MEMORY_DIR);
}

/**
 * Get file stats
 * 获取文件统计信息
 */
function getFileStats(filename) {
  const filePath = path.join(MEMORY_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  return {
    size: (stats.size / 1024).toFixed(2),
    lines: content.split('\n').length,
    modified: stats.mtime,
    exists: true
  };
}

/**
 * Read session metadata
 * 读取会话元数据
 */
function getSessionInfo() {
  const sessionPath = path.join(MEMORY_DIR, 'session.json');
  
  if (!fs.existsSync(sessionPath)) {
    return null;
  }
  
  return JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
}

/**
 * Read configuration
 * 读取配置
 */
function getConfig() {
  const configPath = path.join(MEMORY_DIR, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

/**
 * Count errors in log
 * 计算日志中的错误数
 */
function countErrors() {
  const errorPath = path.join(MEMORY_DIR, 'errors.log');
  
  if (!fs.existsSync(errorPath)) {
    return 0;
  }
  
  const content = fs.readFileSync(errorPath, 'utf-8');
  return content.split('\n').filter(line => line.trim()).length;
}

/**
 * Display status report
 * 显示状态报告
 */
function displayStatus() {
  console.log(`\n${colors.bright}${colors.cyan}🧠 External Memory System - Status${colors.reset}\n`);
  
  if (!isInitialized()) {
    console.log(`${colors.red}✗ Memory system not initialized${colors.reset}`);
    console.log(`\nRun: ${colors.cyan}node .opencode/skills/00-external-memory/scripts/init-memory.js${colors.reset}\n`);
    return;
  }
  
  console.log(`${colors.green}✓ Memory system is active${colors.reset}\n`);
  
  // Session info
  const session = getSessionInfo();
  if (session) {
    console.log(`${colors.bright}Session Information:${colors.reset}`);
    console.log(`  ID: ${colors.dim}${session.sessionId}${colors.reset}`);
    console.log(`  Started: ${new Date(session.startTime).toLocaleString()}`);
    console.log(`  Last Active: ${new Date(session.lastActive).toLocaleString()}`);
    console.log(`  Tool Calls: ${session.toolCallCount}`);
    console.log(`  Current Phase: ${colors.cyan}${session.currentPhase}${colors.reset}\n`);
  }
  
  // Memory files
  console.log(`${colors.bright}Memory Files:${colors.reset}`);
  
  const files = [
    { name: 'context.md', desc: 'Task context and goals' },
    { name: 'findings.md', desc: 'Research and discoveries' },
    { name: 'decisions.md', desc: 'Technical decisions' }
  ];
  
  files.forEach(({ name, desc }) => {
    const stats = getFileStats(name);
    if (stats) {
      console.log(`  ${colors.green}✓${colors.reset} ${name} ${colors.dim}(${stats.size} KB, ${stats.lines} lines)${colors.reset}`);
      console.log(`    ${colors.dim}${desc}${colors.reset}`);
      console.log(`    Modified: ${stats.modified.toLocaleString()}`);
    } else {
      console.log(`  ${colors.red}✗${colors.reset} ${name} ${colors.dim}(missing)${colors.reset}`);
    }
  });
  
  // Error log
  const errorCount = countErrors();
  console.log(`\n${colors.bright}Error Log:${colors.reset}`);
  if (errorCount > 0) {
    console.log(`  ${colors.yellow}⚠${colors.reset} ${errorCount} errors logged`);
  } else {
    console.log(`  ${colors.green}✓${colors.reset} No errors logged`);
  }
  
  // Configuration
  const config = getConfig();
  if (config) {
    console.log(`\n${colors.bright}Configuration:${colors.reset}`);
    console.log(`  Enabled: ${config.enabled ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  Refresh Interval: ${config.refreshInterval} tool calls`);
    console.log(`  Max Error History: ${config.maxErrorHistory}`);
    console.log(`  Auto Cleanup: ${config.autoCleanup ? 'Yes' : 'No'} (after ${config.cleanupAfterDays} days)`);
  }
  
  console.log();
}

/**
 * Main function
 * 主函数
 */
function main() {
  try {
    displayStatus();
  } catch (error) {
    console.error(`\n${colors.red}❌ Error checking status:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, isInitialized, getSessionInfo };
