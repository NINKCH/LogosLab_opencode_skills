#!/usr/bin/env node

/**
 * External Memory System - Context Refresh Script
 * 外部记忆系统 - 上下文刷新脚本
 * 
 * Reads memory files to refresh AI's attention window
 * 读取记忆文件以刷新 AI 的注意力窗口
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
  dim: '\x1b[2m'
};

/**
 * Read and display memory file
 * 读取并显示记忆文件
 */
function readMemoryFile(filename) {
  const filePath = path.join(MEMORY_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`${colors.yellow}⚠${colors.reset} ${filename} not found`);
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
}

/**
 * Update session metadata
 * 更新会话元数据
 */
function updateSessionMetadata() {
  const sessionPath = path.join(MEMORY_DIR, 'session.json');
  
  if (!fs.existsSync(sessionPath)) {
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
  metadata.lastActive = new Date().toISOString();
  metadata.toolCallCount = (metadata.toolCallCount || 0) + 1;
  
  fs.writeFileSync(sessionPath, JSON.stringify(metadata, null, 2));
}

/**
 * Display context summary
 * 显示上下文摘要
 */
function displayContextSummary(context) {
  console.log(`\n${colors.bright}${colors.cyan}📋 Current Context${colors.reset}\n`);
  
  // Extract goal
  const goalMatch = context.match(/## Goal\s*\n([^\n]+)/);
  if (goalMatch) {
    console.log(`${colors.green}Goal:${colors.reset} ${goalMatch[1].trim()}`);
  }
  
  // Extract current phase
  const phaseMatch = context.match(/## Current Phase\s*\n([^\n]+)/);
  if (phaseMatch) {
    console.log(`${colors.cyan}Phase:${colors.reset} ${phaseMatch[1].trim()}`);
  }
  
  // Extract next steps
  const stepsMatch = context.match(/## Next Steps\s*\n([\s\S]*?)(?=\n##|\n---|\n$)/);
  if (stepsMatch) {
    console.log(`\n${colors.cyan}Next Steps:${colors.reset}`);
    const steps = stepsMatch[1].trim().split('\n').slice(0, 3);
    steps.forEach(step => {
      if (step.trim()) {
        console.log(`  ${step.trim()}`);
      }
    });
  }
}

/**
 * Main refresh function
 * 主刷新函数
 */
function main() {
  console.log(`\n${colors.bright}${colors.cyan}🔄 Refreshing Context from Memory${colors.reset}`);
  
  if (!fs.existsSync(MEMORY_DIR)) {
    console.log(`\n${colors.yellow}⚠${colors.reset} Memory system not initialized`);
    console.log(`Run: ${colors.cyan}node .opencode/skills/00-external-memory/scripts/init-memory.js${colors.reset}\n`);
    process.exit(1);
  }
  
  try {
    // Read context file
    const context = readMemoryFile('context.md');
    if (context) {
      displayContextSummary(context);
    }
    
    // Read recent findings
    const findings = readMemoryFile('findings.md');
    if (findings) {
      const findingsLines = findings.split('\n').filter(line => line.trim() && !line.startsWith('#')).slice(0, 5);
      if (findingsLines.length > 0) {
        console.log(`\n${colors.cyan}Recent Findings:${colors.reset}`);
        findingsLines.forEach(line => {
          if (line.trim()) {
            console.log(`  ${colors.dim}${line.trim()}${colors.reset}`);
          }
        });
      }
    }
    
    // Read recent decisions
    const decisions = readMemoryFile('decisions.md');
    if (decisions) {
      const decisionLines = decisions.split('\n').filter(line => line.includes('|') && !line.includes('---')).slice(1, 4);
      if (decisionLines.length > 0) {
        console.log(`\n${colors.cyan}Recent Decisions:${colors.reset}`);
        decisionLines.forEach(line => {
          if (line.trim()) {
            console.log(`  ${colors.dim}${line.trim()}${colors.reset}`);
          }
        });
      }
    }
    
    // Update session metadata
    updateSessionMetadata();
    
    console.log(`\n${colors.green}✓ Context refreshed${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.yellow}❌ Error refreshing context:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, readMemoryFile };
