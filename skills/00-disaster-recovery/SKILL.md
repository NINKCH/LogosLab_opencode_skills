---
name: disaster-recovery
description: Automatic snapshot and rollback system
license: MIT
compatibility: opencode
metadata:
  role: Infrastructure
  workflow: auto-trigger
  language: english
  category: system
  priority: highest
---

# Disaster Recovery System

## Overview

This is a foundational safety system that provides automatic disaster recovery for all AI code operations. As a 00-series infrastructure skill, it automatically triggers snapshots before any file modification, ensuring all operations can be safely rolled back.

## Skill Type

- **Number**: 00 (Infrastructure Skill)
- **Trigger**: Auto-trigger (Before file operations)
- **Priority**: Highest (Executes before all code operations)

## Background Execution & Interaction

- As a system-level infrastructure skill, this runs via hooks around file operations in the background, not as a foreground conversational skill.
- Automatic snapshot creation and reuse always happen silently in the background and do not trigger Interactive Question Mode (e.g. `question`) or extra confirmations.
- Only when the user explicitly asks in the chat to list, rollback, restore, or delete snapshots should the AI explain the intended operation in the foreground; the underlying Git commands remain background maintenance.

## Core Features

### Phase 01: Automatic Snapshot ⚡
- Automatically creates Git Stash snapshots before file operations
- Silent execution, no user confirmation needed
- Smart reuse within 5 minutes to avoid duplication

### Phase 02: Instant Rollback 🔄
- One-click restore to latest safe checkpoint
- View all available backup snapshots
- Selectively restore to any historical snapshot

---

## 📋 Execution Highlights & Stopping Points

- **Auto-snapshot awareness**: Before high-risk file operations, the system checks in the background for a recent snapshot and, if missing, creates one (or runs `auto-snapshot.js`) without interrupting the conversation or asking extra questions.
- **Snapshot inspection**: List available snapshots and choose the correct ID before rollback/restore.
- **⏸ Stopping point for user-requested rollback/delete**: Only when the user explicitly requests `rollback` or `delete` in the chat should the AI explain which snapshot ID will be affected and pause once for confirmation; routine automatic snapshots never show confirmation prompts.
- **Post-restore verification**: After restore, guide the user to verify key files or run tests.

## Command Reference

### Auto-snapshot (AI auto-invokes)
```bash
node .opencode/skills/00-disaster-recovery/scripts/auto-snapshot.js "Operation description"
```

### Manual Commands
```bash
# List snapshots
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js list

# Rollback (delete snapshot)
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js rollback <ID>

# Restore (keep snapshot)
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js restore <ID>

# Create snapshot
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js create "Description"

# Delete snapshot
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js delete <ID>
```

## Technical Implementation

Based on Git Stash:
- ✅ Lightweight, no extra space
- ✅ Fast creation and recovery (< 100ms)
- ✅ Multiple backup points
- ✅ Compatible with Git workflow

## Notes

- Must be used within a Git repository
- Only saves tracked file changes
- Auto-keeps latest 10 snapshots
- New files need `git add` first

---

## 🚫 Forbidden Behaviors

- 🚫 Relying on snapshots outside of initialized Git repositories.
- 🚫 Rolling back or deleting snapshots without inspecting the list and confirming IDs.
- 🚫 Using snapshots as a replacement for proper version control or backups.

## Related Documentation

- **AI-INSTRUCTIONS.md** - Detailed AI usage guide and execution flow
- **hooks/pre-file-operation.md** - Hook specifications and trigger mechanisms
- **Root README.md** - Complete feature description and usage examples
