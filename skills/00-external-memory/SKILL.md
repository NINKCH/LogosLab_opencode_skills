---
name: external-memory
description: File-based external memory system
license: MIT
compatibility: opencode
metadata:
  role: Infrastructure
  workflow: auto-trigger
  language: english
  category: system
  priority: highest
---

# External Memory System

## Overview

A system-level skill that uses the filesystem as external long-term memory to solve context loss, hallucination, and forgetting issues in AI coding assistants. Runs automatically in the background without affecting normal project workflow.

## Core Concept

```
Context Window = RAM (volatile, limited)
Filesystem = Disk (persistent, unlimited)

→ Important information gets written to disk automatically
```

## Skill Type

- **Number**: 00 (Infrastructure Skill)
- **Trigger**: Auto-trigger
- **Priority**: Highest
- **Visibility**: Background

## Background Execution & Interaction

- As a system-level infrastructure skill, automatic initialization, refresh, and error logging all run silently in the background and do not proactively speak to the user.
- When automatically creating, updating, and maintaining the `.memory` directory and its files, do not use Interactive Question Mode (e.g. `question`) or ask the user to confirm each write; these writes are treated as system maintenance.
- Only when the user explicitly requests in the chat to inspect, restructure, or clear memory files should the foreground skill handling that request explain the changes; this skill's background maintenance itself does not take over the foreground.

## Core Features

### 1. Automatic Memory Files

Automatically creates and maintains three core memory files:

| File | Purpose (English) |
|------|-------------------|
| `.memory/context.md` | Current task context and goals |
| `.memory/findings.md` | Discoveries and research notes |
| `.memory/decisions.md` | Technical decisions and rationale |

### 2. Auto-Refresh Mechanism

- Automatically re-reads memory files every 10 tool calls
- Prevents "lost in the middle" effect
- Keeps goals in attention window

### 3. Error Tracking

Automatically logs all errors to prevent repetition

### 4. Session Recovery

Recovers context after `/clear` or session restart

## File Structure

```
your-project/
├── .memory/                    # Memory directory (auto-created)
│   ├── context.md             # Current task context
│   ├── findings.md            # Research and discoveries
│   ├── decisions.md           # Technical decisions
│   ├── errors.log             # Error history
│   └── session.json           # Session metadata
├── src/
└── package.json
```

## Auto-Trigger Rules

The system automatically activates when:

1. **Task Start** - Creates memory files if they don't exist
2. **Every 10 Tool Calls** - Re-reads context to refresh attention
3. **Error Occurs** - Logs error to prevent repetition
4. **File Modified** - Updates relevant memory files
5. **Session Start** - Checks for previous session context

## Memory File Templates

The detailed structures for each memory file live in dedicated template files:

- `.memory/context.md` → `templates/context-template.md`
- `.memory/findings.md` → `templates/findings-template.md`
- `.memory/decisions.md` → `templates/decisions-template.md`

Refer to these templates when initializing or editing memory files.
They are the single source of truth for memory file layout and inline guidance.

## AI Behavior Rules

### Rule 1: Auto-Create on Task Start

When starting a complex task (>5 tool calls expected), automatically create `.memory/` directory and initialize files.

### Rule 2: The 10-Call Refresh

After every 10 tool calls, automatically read `context.md` to refresh goals in attention window.

### Rule 3: Immediate Error Logging

 When any error occurs, immediately append to `errors.log` with:
- Error message
- Attempt number
- Resolution (if found)

### Rule 4: Discovery Capture

After viewing images, PDFs, or web content, immediately save key findings to `findings.md` before information is lost.

### Rule 5: Decision Documentation

When making technical decisions, immediately log to `decisions.md` with rationale.

### Rule 6: Never Repeat Failures

Before retrying a failed action, check `errors.log`. If same error occurred before, use different approach.

---

## 📋 Execution Highlights & Stopping Points
These highlights mainly apply when the AI is explicitly handling `.memory` files in the foreground (e.g. when the user asks to inspect or restructure memory); for automatically triggered background maintenance, no extra questions or confirmations are needed.

- **Task initialization**: At complex task start, check for `.memory/` and run `init-memory.js` if missing, announcing created files.
- **Context refresh cadence**: On every 10-call refresh, bring goals back into focus and optionally restate them.
- **⏸ Stopping point before overwriting memory files**: Before heavily rewriting memory files, summarize existing content and explain planned changes.
- **Error and decision logging**: After errors or key decisions, update `errors.log` and `decisions.md` before proceeding.

## Commands

### Auto-Initialize
```bash
# AI automatically runs this when starting complex tasks
node .opencode/skills/00-external-memory/scripts/init-memory.js
```

### Manual Refresh
```bash
# Manually refresh context (rarely needed)
node .opencode/skills/00-external-memory/scripts/refresh-context.js
```

### Session Recovery
```bash
# Recover context after /clear or restart
node .opencode/skills/00-external-memory/scripts/recover-session.js
```

### View Memory Status
```bash
# Check memory system status
node .opencode/skills/00-external-memory/scripts/memory-status.js
```

## Technical Implementation

### Memory Update Triggers

```javascript
// Pseudo-code for AI behavior

let toolCallCount = 0;

function onToolCall(tool, result) {
  toolCallCount++;
  
  // Auto-refresh every 10 calls
  if (toolCallCount % 10 === 0) {
    readFile('.memory/context.md');
  }
  
  // Log errors immediately
  if (result.error) {
    appendToFile('.memory/errors.log', {
      error: result.error,
      attempt: getAttemptNumber(tool),
      timestamp: new Date()
    });
  }
  
  // Capture discoveries
  if (tool === 'browser' || tool === 'image_view') {
    promptToSaveFindings();
  }
}
```

### Session Metadata

```json
{
  "sessionId": "uuid",
  "startTime": "2024-01-19T10:00:00Z",
  "lastActive": "2024-01-19T10:30:00Z",
  "toolCallCount": 45,
  "currentPhase": "Implementation",
  "memoryFiles": {
    "context": ".memory/context.md",
    "findings": ".memory/findings.md",
    "decisions": ".memory/decisions.md"
  }
}
```

## Benefits

### 1. Prevents Context Loss

After 50+ tool calls, original goals remain accessible through memory files.

### 2. Reduces Hallucination

Grounded in written facts, not just volatile context.

### 3. Enables Learning

Error log prevents repeating same mistakes.

### 4. Improves Consistency

Decisions are documented and can be referenced later.

### 5. Session Continuity

Work can resume seamlessly after interruptions.

## Best Practices

### For AI

1. **Auto-create memory files** at task start
2. **Read context every 10 calls** to stay oriented
3. **Log errors immediately** with attempt number
4. **Save discoveries** before they're lost from context
5. **Document decisions** with clear rationale

### For Users

1. **Don't delete `.memory/` folder** - it's your AI's memory
2. **Review memory files** to understand AI's thinking
3. **Add to `.gitignore`** if contains sensitive info
4. **Use session recovery** after `/clear`

## Configuration

### .memory/config.json

```json
{
  "enabled": true,
  "refreshInterval": 10,
  "maxErrorHistory": 100,
  "autoCleanup": true,
  "cleanupAfterDays": 7,
  "excludePatterns": [
    "node_modules/**",
    ".git/**",
    "dist/**"
  ]
}
```

## Notes

- Memory files are created in `.memory/` directory
- System runs automatically in background
- Does not interfere with normal project workflow
- Can be disabled by setting `enabled: false` in config

---

## 🚫 Forbidden Behaviors

- 🚫 Deleting or resetting `.memory/` contents without informing the user.
- 🚫 Repeating the same failing action multiple times without consulting `errors.log`.
- 🚫 Storing highly sensitive data in plaintext memory files without warning the user.
- 🚫 Assuming memory files stay updated after the system has been disabled in config.

## Related Documentation

- **scripts/init-memory.js** - Initialize memory system
- **scripts/refresh-context.js** - Refresh context manually
- **scripts/recover-session.js** - Recover from previous session
- **templates/** - Memory file templates
