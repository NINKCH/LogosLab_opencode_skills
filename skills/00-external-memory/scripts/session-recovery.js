#!/usr/bin/env node
/**
 * Session Recovery Script for external-memory
 * 
 * Analyzes the previous session to find unsynced context after the last
 * memory file update. Designed to run on SessionStart.
 * 
 * Usage: node session-recovery.js [project-path]
 */

const fs = require('fs');
const path = require('path');

const MEMORY_FILES = ['context.md', 'findings.md', 'decisions.md', 'errors.log'];

function getProjectDir(projectPath) {
  // Convert project path to storage path format
  // This is a simplified version - adjust based on your IDE's storage structure
  const sanitized = projectPath.replace(/\//g, '-').replace(/_/g, '-');
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  
  // Try different IDE paths
  const possiblePaths = [
    path.join(homeDir, '.opencode', 'projects', sanitized),
    path.join(homeDir, '.claude', 'projects', sanitized),
    path.join(homeDir, '.cursor', 'projects', sanitized),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return null;
}

function getSessionsSorted(projectDir) {
  if (!fs.existsSync(projectDir)) {
    return [];
  }
  
  const files = fs.readdirSync(projectDir);
  const sessions = files
    .filter(f => f.endsWith('.jsonl') && !f.startsWith('agent-'))
    .map(f => ({
      path: path.join(projectDir, f),
      mtime: fs.statSync(path.join(projectDir, f)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);
  
  return sessions.map(s => s.path);
}

function parseSessionMessages(sessionFile) {
  const messages = [];
  const content = fs.readFileSync(sessionFile, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, lineNum) => {
    if (!line.trim()) return;
    
    try {
      const data = JSON.parse(line);
      data._line_num = lineNum;
      messages.push(data);
    } catch (e) {
      // Skip invalid JSON lines
    }
  });
  
  return messages;
}

function findLastMemoryUpdate(messages) {
  let lastUpdateLine = -1;
  let lastUpdateFile = null;
  
  for (const msg of messages) {
    const msgType = msg.type;
    
    if (msgType === 'assistant') {
      const content = msg.message?.content || [];
      if (!Array.isArray(content)) continue;
      
      for (const item of content) {
        if (item.type === 'tool_use') {
          const toolName = item.name || '';
          const toolInput = item.input || {};
          
          if (toolName === 'fsWrite' || toolName === 'strReplace' || toolName === 'fsAppend') {
            const filePath = toolInput.path || '';
            for (const mf of MEMORY_FILES) {
              if (filePath.includes('.memory/') && filePath.endsWith(mf)) {
                lastUpdateLine = msg._line_num;
                lastUpdateFile = mf;
              }
            }
          }
        }
      }
    }
  }
  
  return { lastUpdateLine, lastUpdateFile };
}

function extractMessagesAfter(messages, afterLine) {
  const result = [];
  
  for (const msg of messages) {
    if (msg._line_num <= afterLine) continue;
    
    const msgType = msg.type;
    const isMeta = msg.isMeta || false;
    
    if (msgType === 'user' && !isMeta) {
      let content = msg.message?.content || '';
      
      if (Array.isArray(content)) {
        for (const item of content) {
          if (item.type === 'text') {
            content = item.text || '';
            break;
          }
        }
      }
      
      if (typeof content === 'string' && content.length > 20) {
        // Skip system messages
        if (content.startsWith('<local-command') || 
            content.startsWith('<command-') || 
            content.startsWith('<task-notification')) {
          continue;
        }
        
        result.push({
          role: 'user',
          content: content.substring(0, 300),
          line: msg._line_num
        });
      }
    } else if (msgType === 'assistant') {
      const msgContent = msg.message?.content || '';
      let textContent = '';
      const toolUses = [];
      
      if (typeof msgContent === 'string') {
        textContent = msgContent;
      } else if (Array.isArray(msgContent)) {
        for (const item of msgContent) {
          if (item.type === 'text') {
            textContent = item.text || '';
          } else if (item.type === 'tool_use') {
            const toolName = item.name || '';
            const toolInput = item.input || {};
            
            if (toolName === 'strReplace' || toolName === 'fsWrite') {
              toolUses.push(`${toolName}: ${toolInput.path || 'unknown'}`);
            } else if (toolName === 'executePwsh') {
              const cmd = (toolInput.command || '').substring(0, 80);
              toolUses.push(`Bash: ${cmd}`);
            } else {
              toolUses.push(toolName);
            }
          }
        }
      }
      
      if (textContent || toolUses.length > 0) {
        result.push({
          role: 'assistant',
          content: textContent.substring(0, 600),
          tools: toolUses,
          line: msg._line_num
        });
      }
    }
  }
  
  return result;
}

function main() {
  const projectPath = process.argv[2] || process.cwd();
  const memoryDir = path.join(projectPath, '.memory');
  
  // Check if memory files exist (indicates active task)
  const hasMemoryFiles = MEMORY_FILES.some(f => 
    fs.existsSync(path.join(memoryDir, f))
  );
  
  const projectDir = getProjectDir(projectPath);
  
  if (!projectDir) {
    // No previous sessions, nothing to catch up on
    return;
  }
  
  const sessions = getSessionsSorted(projectDir);
  if (sessions.length < 1) {
    return;
  }
  
  // Find a substantial previous session
  let targetSession = null;
  for (const session of sessions) {
    const stats = fs.statSync(session);
    if (stats.size > 5000) {
      targetSession = session;
      break;
    }
  }
  
  if (!targetSession) {
    return;
  }
  
  const messages = parseSessionMessages(targetSession);
  const { lastUpdateLine, lastUpdateFile } = findLastMemoryUpdate(messages);
  
  // Only output if there's unsynced content
  let messagesAfter;
  if (lastUpdateLine < 0) {
    messagesAfter = extractMessagesAfter(messages, messages.length - 30);
  } else {
    messagesAfter = extractMessagesAfter(messages, lastUpdateLine);
  }
  
  if (messagesAfter.length === 0) {
    return;
  }
  
  // Output catchup report
  console.log('\n[external-memory] SESSION RECOVERY DETECTED');
  console.log(`Previous session: ${path.basename(targetSession, '.jsonl')}`);
  
  if (lastUpdateLine >= 0) {
    console.log(`Last memory update: ${lastUpdateFile} at message #${lastUpdateLine}`);
    console.log(`Unsynced messages: ${messagesAfter.length}`);
  } else {
    console.log('No memory file updates found in previous session');
  }
  
  console.log('\n--- UNSYNCED CONTEXT ---');
  const recentMessages = messagesAfter.slice(-15); // Last 15 messages
  
  for (const msg of recentMessages) {
    if (msg.role === 'user') {
      console.log(`USER: ${msg.content}`);
    } else {
      if (msg.content) {
        console.log(`AI: ${msg.content}`);
      }
      if (msg.tools && msg.tools.length > 0) {
        console.log(`  Tools: ${msg.tools.slice(0, 4).join(', ')}`);
      }
    }
  }
  
  console.log('\n--- RECOMMENDED ACTIONS ---');
  console.log('1. Run: git diff --stat (to see code changes)');
  console.log('2. Read: .memory/context.md, .memory/findings.md');
  console.log('3. Update memory files based on above context');
  console.log('4. Continue with task\n');
}

if (require.main === module) {
  main();
}

module.exports = { main };
