#!/usr/bin/env node

/**
 * External Memory System - Initialization Script
 * 外部记忆系统 - 初始化脚本
 * 
 * Automatically creates memory files for complex tasks
 * 自动为复杂任务创建记忆文件
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = '.memory';
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

/**
 * Create memory directory if it doesn't exist
 * 如果不存在则创建记忆目录
 */
function createMemoryDir() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
    console.log(`${colors.green}✓${colors.reset} Created ${colors.cyan}${MEMORY_DIR}/${colors.reset} directory`);
    return true;
  }
  return false;
}

/**
 * Initialize a memory file from template
 * 从模板初始化记忆文件
 */
function initMemoryFile(filename, templateName) {
  const filePath = path.join(MEMORY_DIR, filename);
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  
  if (fs.existsSync(filePath)) {
    console.log(`${colors.yellow}⊙${colors.reset} ${filename} already exists, skipping`);
    return false;
  }
  
  if (!fs.existsSync(templatePath)) {
    console.error(`${colors.yellow}⚠${colors.reset} Template ${templateName} not found, creating basic file`);
    const timestamp = new Date().toISOString();
    const basicContent = `# ${filename.replace('.md', '').replace(/-/g, ' ').toUpperCase()}\n\n---\nCreated: ${timestamp}\n`;
    fs.writeFileSync(filePath, basicContent);
  } else {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const timestamp = new Date().toISOString();
    const content = template.replace(/\[timestamp\]/g, timestamp);
    fs.writeFileSync(filePath, content);
  }
  
  console.log(`${colors.green}✓${colors.reset} Created ${colors.cyan}${filePath}${colors.reset}`);
  return true;
}

/**
 * Create session metadata file
 * 创建会话元数据文件
 */
function createSessionMetadata() {
  const sessionPath = path.join(MEMORY_DIR, 'session.json');
  
  const metadata = {
    sessionId: generateSessionId(),
    startTime: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    toolCallCount: 0,
    currentPhase: 'Discovery',
    memoryFiles: {
      context: `${MEMORY_DIR}/context.md`,
      findings: `${MEMORY_DIR}/findings.md`,
      decisions: `${MEMORY_DIR}/decisions.md`
    }
  };
  
  fs.writeFileSync(sessionPath, JSON.stringify(metadata, null, 2));
  console.log(`${colors.green}✓${colors.reset} Created session metadata`);
}

/**
 * Create default configuration
 * 创建默认配置
 */
function createConfig() {
  const configPath = path.join(MEMORY_DIR, 'config.json');
  
  if (fs.existsSync(configPath)) {
    return;
  }
  
  const config = {
    enabled: true,
    refreshInterval: 10,
    maxErrorHistory: 100,
    autoCleanup: true,
    cleanupAfterDays: 7,
    excludePatterns: [
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**'
    ]
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`${colors.green}✓${colors.reset} Created configuration file`);
}

/**
 * Generate unique session ID
 * 生成唯一会话 ID
 */
function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create .gitignore entry
 * 创建 .gitignore 条目
 */
function updateGitignore() {
  const gitignorePath = '.gitignore';
  const memoryEntry = '\n# External Memory System\n.memory/\n';
  
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    if (!content.includes('.memory/')) {
      fs.appendFileSync(gitignorePath, memoryEntry);
      console.log(`${colors.green}✓${colors.reset} Added .memory/ to .gitignore`);
    }
  } else {
    fs.writeFileSync(gitignorePath, memoryEntry);
    console.log(`${colors.green}✓${colors.reset} Created .gitignore with .memory/ entry`);
  }
}

/**
 * Main initialization function
 * 主初始化函数
 */
function main() {
  console.log(`\n${colors.bright}${colors.cyan}🧠 External Memory System - Initialization${colors.reset}\n`);
  
  try {
    // Create memory directory
    const isNew = createMemoryDir();
    
    // Initialize memory files
    initMemoryFile('context.md', 'context-template.md');
    initMemoryFile('findings.md', 'findings-template.md');
    initMemoryFile('decisions.md', 'decisions-template.md');
    
    // Create session metadata
    createSessionMetadata();
    
    // Create configuration
    createConfig();
    
    // Update .gitignore
    updateGitignore();
    
    console.log(`\n${colors.green}${colors.bright}✓ Memory system initialized successfully!${colors.reset}`);
    console.log(`\n${colors.cyan}Memory files created in:${colors.reset} ${MEMORY_DIR}/`);
    console.log(`${colors.cyan}Next steps:${colors.reset}`);
    console.log(`  1. Update ${MEMORY_DIR}/context.md with your task goal`);
    console.log(`  2. AI will automatically maintain these files`);
    console.log(`  3. Review files periodically to track progress\n`);
    
  } catch (error) {
    console.error(`\n${colors.yellow}❌ Error initializing memory system:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, createMemoryDir, initMemoryFile };
