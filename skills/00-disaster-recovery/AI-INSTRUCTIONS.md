# AI Instructions - Disaster Recovery System

## IMPORTANT: Auto-Triggered Foundational Skill

As an AI assistant, you MUST **automatically** invoke this skill before performing any file modification, without explicit user request.

## Trigger Conditions

You **MUST** create an automatic snapshot before executing any of the following operations:

- `fsWrite` - Creating or overwriting a file
- `fsAppend` - Appending to a file
- `strReplace` - Replacing content within a file
- `deleteFile` - Deleting a file
- Any batch file operations

## Standard Execution Flow

```
User Request → Auto-Snapshot → Execute Operation → Complete
```

### Example: Single File Modification

```
User: "Help me modify src/auth.js to add error handling"

AI Executes:
1. node .opencode/skills/00-disaster-recovery/scripts/auto-snapshot.js "Add error handling to auth module"
2. fsWrite or strReplace
3. Inform user of completion

AI Responds:
"✓ Snapshot created.
✓ Error handling logic has been added. You can roll back at any time if there's an issue."
```

### Example: User Requests Rollback

```
User: "There was a problem with that last change, please roll back."

AI Executes:
1. node .opencode/skills/00-disaster-recovery/scripts/snapshot.js list
2. node .opencode/skills/00-disaster-recovery/scripts/snapshot.js rollback 0

AI Responds:
"✓ Rolled back to the state before the modification. All changes have been reverted."
```

## Command Quick Reference

### Auto-Snapshot (Recommended)
```bash
node .opencode/skills/00-disaster-recovery/scripts/auto-snapshot.js "Description of operation"
```

### List Snapshots
```bash
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js list
```

### Rollback to Latest Snapshot
```bash
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js rollback 0
```

### Restore Snapshot (and keep it)
```bash
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js restore 0
```

## Notes

1. **Silent Execution** - Snapshot creation is a background task and should only output a brief status.
2. **Non-Blocking on Failure** - If snapshotting fails, proceed with the operation but warn the user.
3. **5-Minute Reuse** - Repeated operations within 5 minutes will automatically reuse the most recent snapshot.
4. **Clear Rollback Info** - When rolling back, provide clear information about which snapshot is being used.

## Error Handling

### Not in a Git Repository
```
⚠️  Not currently in a Git repository. Cannot create a snapshot.
Proceeding with the operation, but rollback functionality is unavailable.
```

### Snapshot Creation Failure
```
⚠️  Snapshot creation failed, but the operation will proceed.
Note: This operation cannot be rolled back.
```

### Rollback Failure
```
❌ Rollback failed: [Error Message]
Suggestion: Manually inspect with 'git stash list'.
```
