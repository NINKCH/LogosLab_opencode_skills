#!/usr/bin/env node

/**
 * External Memory System - Session Recovery Script
 * 外部记忆系统 - 会话恢复脚本
 * 
 * Recovers context after /clear or session restart
 * 在 /clear 或会话重启后恢复上下文
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MEMORY_DIR = '.memory';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

/**
 * Check if memory system exists
 * 检查记忆系统是否存在
 */
function checkMemorySystem() {
  if (!fs.existsSync(MEMORY_DIR)) {
    console.log(`\n${colors.yellow}⚠${colors.reset} No previous session found`);
    console.log(`Memory system not initialized in this project\n`);
    return false;
  }
  return true;
}

/**
 * Read session metadata
 * 读取会话元数据
 */
function readSessionMetadata() {
  const sessionPath = path.join(MEMORY_DIR, 'session.json');
  
  if (!fs.existsSync(sessionPath)) {
    return null;
  }
  
  return JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
}

/**
 * Get git changes since last session
 * 获取自上次会话以来的 git 更改
 */
function getGitChanges(since) {
  try {
    const sinceDate = new Date(since).toISOString();
    const changes = execSync(`git diff --stat --since="${sinceDate}"`, { encoding: 'utf-8' });
    return changes.trim();
  } catch (error) {
    return null;
  }
}

/**
 * Display recovery report
 * 显示恢复报告
 */
function displayRecoveryReport(metadata) {
  console.log(`\n${colors.bright}${colors.cyan}🔄 Session Recovery Report${colors.reset}\n`);
  
  console.log(`${colors.cyan}Previous Session:${colors.reset}`);
  console.log(`  ID: ${metadata.sessionId}`);
  console.log(`  Started: ${new Date(metadata.startTime).toLocaleString()}`);
  console.log(`  Last Active: ${new Date(metadata.lastActive).toLocaleString()}`);
  console.log(`  Tool Calls: ${metadata.toolCallCount}`);
  console.log(`  Phase: ${metadata.currentPhase}`);
  
  // Calculate time since last activity
  const lastActive = new Date(metadata.lastActive);
  const now = new Date();
  const hoursSince = Math.floor((now - lastActive) / (1000 * 60 * 60));
  const minutesSince = Math.floor((now - lastActive) / (1000 * 60)) % 60;
  
  console.log(`\n${colors.yellow}Time Since Last Activity:${colors.reset} ${hoursSince}h ${minutesSince}m`);
  
  // Check for git changes
  const gitChanges = getGitChanges(metadata.lastActive);
  if (gitChanges) {
    console.log(`\n${colors.cyan}Code Changes Since Last Session:${colors.reset}`);
    console.log(gitChanges);
  }
}

/**
 * Read and display memory files
 * 读取并显示记忆文件
 */
function displayMemoryFiles() {
  console.log(`\n${colors.bright}${colors.cyan}📚 Memory Files${colors.reset}\n`);
  
  const files = ['context.md', 'findings.md', 'decisions.md'];
  
  files.forEach(filename => {
    const filePath = path.join(MEMORY_DIR, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      const modified = stats.mtime.toLocaleString();
      console.log(`${colors.green}✓${colors.reset} ${filename}`);
      console.log(`  Size: ${size} KB`);
      console.log(`  Modified: ${modified}\n`);
    } else {
      console.log(`${colors.red}✗${colors.reset} ${filename} (missing)\n`);
    }
  });
}

/**
 * Display recovery instructions
 * 显示恢复说明
 */
function displayInstructions() {
  console.log(`${colors.bright}${colors.cyan}📋 Recovery Steps:${colors.reset}\n`);
  console.log(`1. Read ${colors.cyan}.memory/context.md${colors.reset} to understand the task`);
  console.log(`2. Review ${colors.cyan}.memory/findings.md${colors.reset} for discoveries`);
  console.log(`3. Check ${colors.cyan}.memory/decisions.md${colors.reset} for technical choices`);
  console.log(`4. Run ${colors.cyan}git diff --stat${colors.reset} to see code changes`);
  console.log(`5. Update memory files based on current state`);
  console.log(`6. Continue with the task\n`);
}

/**
 * Update session for recovery
 * 更新会话以进行恢复
 */
function updateSessionForRecovery(metadata) {
  const sessionPath = path.join(MEMORY_DIR, 'session.json');
  
  metadata.lastActive = new Date().toISOString();
  metadata.recovered = true;
  metadata.recoveryTime = new Date().toISOString();
  
  fs.writeFileSync(sessionPath, JSON.stringify(metadata, null, 2));
}

/**
 * Main recovery function
 * 主恢复函数
 */
function main() {
  console.log(`\n${colors.bright}${colors.cyan}🧠 External Memory System - Session Recovery${colors.reset}`);
  
  if (!checkMemorySystem()) {
    process.exit(1);
  }
  
  try {
    const metadata = readSessionMetadata();
    
    if (!metadata) {
      console.log(`\n${colors.yellow}⚠${colors.reset} No session metadata found`);
      console.log(`Memory files exist but session data is missing\n`);
      displayMemoryFiles();
      process.exit(1);
    }
    
    // Display recovery report
    displayRecoveryReport(metadata);
    
    // Display memory files status
    displayMemoryFiles();
    
    // Display recovery instructions
    displayInstructions();
    
    // Update session
    updateSessionForRecovery(metadata);
    
    console.log(`${colors.green}${colors.bright}✓ Session recovery complete!${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.red}❌ Error recovering session:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, readSessionMetadata };
