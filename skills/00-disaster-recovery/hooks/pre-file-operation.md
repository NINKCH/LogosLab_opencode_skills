# Pre-File-Operation Hook Specification

## Hook Definition

This is a **Pre-hook** that automatically triggers before a file modification operation is executed.

## Trigger Conditions

Triggers when the AI is about to perform any of the following actions:

| Operation | Tool Function | Description |
|---|---|---|
| Create/Overwrite File | `fsWrite` | Write a new file or overwrite an existing one |
| Replace Content | `strReplace` | Replace a string within a file |
| Append Content | `fsAppend` | Append content to the end of a file |
| Delete File | `deleteFile` | Delete a specified file |
| Batch Operations | Multiple calls to the above | Modify multiple files in one go |

## Hook Behavior

### 1. Automatic Silent Execution
- When trigger conditions are met, the agent automatically calls in the background:  
  `node .opencode/skills/00-disaster-recovery/scripts/auto-snapshot.js "Operation description"`  
- Does not output extra prompts in the foreground or ask the user questions.

### 2. Smart Optimization
- **5-Minute Reuse**: Reuses the most recent snapshot within a configured time window to avoid duplicate creations.
- **Skip if Clean**: Skips snapshot creation if no changes are detected in the workspace.
- **Auto-Cleanup**: Only keeps the 10 most recent automatic snapshots.

### 3. Failure Handling
- A snapshot failure does not block the subsequent file operation.
- The reason for failure is logged internally for later inspection.
- Does not interrupt the current workflow in the foreground.

## Hook Flow

```
┌─────────────────┐
│   User Request    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI Identifies Op  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Trigger Pre-Hook │◄─── This Hook
│ auto-snapshot.js │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Execute File Op   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return to User   │
└─────────────────┘
```

## Operation Description Guidelines

The description passed to the snapshot script should be clear and specific:

### ✅ Good Descriptions
- "Modify user authentication module"
- "Refactor database connection logic"
- "Batch update component styles"
- "Delete deprecated utility functions"

### ❌ Descriptions to Avoid
- "Modify file" (too vague)
- "Update code" (not specific)

## Configuration Options

Behavior can be adjusted via environment variables:

| Variable | Default | Description |
|---|---|---|
| `SNAPSHOT_INTERVAL` | 5 minutes | Auto-snapshot interval |
| `SNAPSHOT_MAX_COUNT` | 10 | Max number of snapshots to keep |
| `SNAPSHOT_SILENT` | false | Silent mode |

## Notes

1. **Git Repository Required** - Must be used within a Git repository.
2. **Performance Impact** - Snapshot creation is very fast (< 100ms).
3. **Storage Space** - Git Stash does not take up extra disk space.
4. **Auto-Cleanup** - Only the 10 most recent auto-snapshots are kept.
