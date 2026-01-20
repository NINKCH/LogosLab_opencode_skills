# AI Instructions - External Memory System

## Critical: Auto-Trigger System

This skill runs automatically in the background. Invoke it without user prompting when conditions are met.

## When to Auto-Initialize

**Trigger Conditions**:

1. **Complex Task Detected**
   - Multi-step task (>5 expected tool calls)
   - Involves research, planning, or implementation
   - Spans multiple interactions

2. **No Memory System Exists**
   - `.memory/` directory doesn't exist

**Action**:
```bash
node .opencode/skills/00-external-memory/scripts/init-memory.js
```

## Auto-Refresh Rules

### Rule 1: The 10-Call Refresh

After every 10 tool calls, automatically run:

```bash
node .opencode/skills/00-external-memory/scripts/refresh-context.js
```

**Why**: Prevents "lost in the middle" effect. Keeps goals in attention window.

**Implementation**:
```javascript
// Pseudo-code for AI behavior
let toolCallCount = 0;

function onToolCall(tool, result) {
  toolCallCount++;
  
  // Auto-refresh every 10 calls
  if (toolCallCount % 10 === 0) {
    exec('node .opencode/skills/00-external-memory/scripts/refresh-context.js');
    readFile('.memory/context.md');
  }
}
```

### Rule 2: The 2-Action Rule

**CRITICAL**: After every 2 view/browser/search/image operations, IMMEDIATELY save findings.

Multimodal content (images, PDFs, browser results) doesn't persist in context. Must be captured as text immediately.

**Implementation**:
```javascript
let visualOperationCount = 0;

function onVisualOperation(tool) {
  if (['mcp_fetch_fetch', 'readFile', 'grepSearch'].includes(tool)) {
    visualOperationCount++;
    
    if (visualOperationCount >= 2) {
      // MUST update findings.md NOW
      appendToFile('.memory/findings.md', capturedFindings);
      visualOperationCount = 0;
    }
  }
}
```

### Rule 3: Session Start Check

At the start of each session, check if memory system exists:

```javascript
if (fs.existsSync('.memory/')) {
  // Run session recovery
  exec('node .opencode/skills/00-external-memory/scripts/session-recovery.js');
  // Read memory files to restore context
  readFile('.memory/context.md');
  readFile('.memory/findings.md');
}
```

## Memory Update Triggers

### Trigger 1: After Discovery (2-Action Rule)

**CRITICAL**: MOST IMPORTANT rule for preventing information loss.

**When**:
- After EVERY 2 view/browser/search/image operations
- After viewing images, PDFs, or web content
- After searching documentation
- After analyzing code structure

**Action**:
Immediately update .memory/findings.md with:
- What was discovered
- Source (URL, file path, etc.)
- Relevance to current task
- Date of discovery

**Why**: Visual/multimodal information gets lost when context resets. Text persists.

**Example**:
```
User: "Check the API documentation"
AI: [Operation 1: Fetches URL]
AI: [Operation 2: Reads documentation]
AI: [MUST NOW update .memory/findings.md]
    | API uses JWT auth | https://api.example.com/docs | 2024-01-19 | Auth implementation |
AI: "I found that the API uses JWT authentication. Let me implement that..."
```

**Counter Example (WRONG)**:
```
AI: [Operation 1: Fetches URL]
AI: [Operation 2: Reads documentation]
AI: [Operation 3: Searches for examples]  ❌ TOO LATE - info from Op 1-2 may be lost!
```

### Trigger 2: After Decision

**When**:
- Choosing technology or approach
- Making architectural decision
- Selecting design pattern

**Action**:
Immediately update .memory/decisions.md with:
- Decision made
- Rationale
- Date

### Trigger 3: After Error

**When**:
- Any error occurs
- Command fails
- Test fails

**Action**:
Immediately append to .memory/errors.log:
```
[2024-01-19 10:30:00] Attempt 1: FileNotFoundError in config.py
Resolution: Created default config file
```

**Critical**: Before retrying, check errors.log to avoid repeating same mistake.

### Trigger 4: Phase Completion

**When**:
- Completing a major phase
- Finishing feature implementation
- Completing testing

**Action**:
Update .memory/context.md:
- Mark phase as complete
- Update "Current Phase"
- Update "Next Steps"

## Error Prevention Protocol

### The 3-Strike Error Protocol

When an error occurs, follow this systematic approach:
```
ATTEMPT 1: Diagnose & Fix
  → Read error carefully
  → Identify root cause
  → Apply targeted fix
  → Log to .memory/errors.log

ATTEMPT 2: Alternative Approach
  → Same error? Try different method
  → Different tool? Different library?
  → NEVER repeat exact same failing action
  → Log attempt to .memory/errors.log

ATTEMPT 3: Broader Rethink
  → Question assumptions
  → Search for solutions
  → Consider updating the plan
  → Log attempt to .memory/errors.log

AFTER 3 FAILURES: Escalate to User
  → Explain what you tried
  → Share the specific error
  → Ask for guidance
```

### Before Retrying Failed Action

**CRITICAL**: ALWAYS check error log before retrying.

```javascript
// Pseudo-code for AI behavior
function beforeRetry(action, error) {
  // 1. Check error log
  const errorLog = readFile('.memory/errors.log');
  
  // 2. Check if same error occurred before
  if (errorLog.includes(error.message)) {
    // 3. DO NOT repeat same action
    // 4. Try different approach
    return differentApproach(action);
  }
  
  // 5. Log this attempt
  appendToFile('.memory/errors.log', {
    timestamp: new Date(),
    attempt: getAttemptNumber(action),
    error: error.message,
    action: action.name
  });
  
  // 6. Try modified approach
  return modifiedApproach(action);
}
```

### Never Repeat Failures

**The Golden Rule**:
```
if action_failed:
    next_action != same_action
```

Track what you tried. Mutate the approach.

**Example**:
```
❌ WRONG:
Action: Read config.json
Error: File not found
Action: Read config.json  # Silent retry - WRONG!
Action: Read config.json  # Another retry - WRONG!

✅ CORRECT:
Action: Read config.json
Error: File not found
[Log to .memory/errors.log]
Action: Check if file exists with listDirectory
Action: Create default config.json
Action: Read config.json
Success!
```

## Context Refresh Strategy

### Read vs Write Decision Matrix

Know when to read vs write memory files for optimal performance.

| Situation | Action | Reason |
|-----------|--------|--------|
| Just wrote a file | DON'T read | Content still in context |
| Viewed image/PDF | Write findings NOW | Multimodal → text before lost |
| Browser returned data | Write to file | Screenshots don't persist |
| Starting new phase | Read plan/findings | Re-orient if context stale |
| Error occurred | Read relevant file | Need current state to fix |
| Resuming after gap | Read all memory files | Recover state |
| After 10 tool calls | Read context.md | Refresh goals in attention |
| Made a decision | Write to decisions.md | Document immediately |

### When to Read Memory Files

**Always Read**:
1. Every 10 tool calls (automatic)
2. Before making major decisions
3. After long sequence of operations
4. When user asks "where are we?" or "what's next?"
5. At session start (if .memory/ exists)

**Never Read**:
1. Immediately after writing (content still in context)
2. For simple, single-step tasks
3. When context is fresh (< 5 tool calls)

### What to Extract from Memory

**From context.md**:
- Current goal
- Current phase
- Next steps

**From findings.md**:
- Recent discoveries (last 5)
- Important URLs
- Key patterns

**From decisions.md**:
- Recent decisions (last 3)
- Current architecture choices

## Silent Operation

Memory system should operate silently in background. Don't announce every memory update to user.

**Good**:
```
AI: [Silently updates .memory/findings.md]
AI: "I found that the API uses JWT authentication. Let me implement that..."
```

**Bad**:
```
AI: "I'm now updating the memory system with this finding..."
AI: "Memory file updated successfully..."
AI: "Now I'll continue with the task..."
```

## Integration with Other Skills

### With Disaster Recovery

Memory files should be included in snapshots.

```bash
# Before major changes
git add .memory/
# Snapshot includes memory state
```

### With Planning Skills

External memory complements task planning.

- `task_plan.md` = High-level phases
- `.memory/context.md` = Current detailed state

## Performance Considerations

- Memory files are small (< 10KB each)
- Reading is fast (< 10ms)
- Updates are append-only (efficient)
- No impact on normal workflow

## Example Workflow

```
User: "Build a REST API with authentication"

AI: [Detects complex task]
AI: [Auto-initializes memory system]
    → node .opencode/skills/00-external-memory/scripts/init-memory.js
    
AI: [Updates context.md]
    Goal: Build REST API with JWT authentication
    Phase: Planning
    
AI: [Researches JWT]
AI: [Updates findings.md]
    | JWT uses HS256 | jwt.io/docs | 2024-01-19 |
    
AI: [Makes decision]
AI: [Updates decisions.md]
    | Use Express + jsonwebtoken | Mature, well-documented | 2024-01-19 |
    
AI: [After 10 tool calls]
AI: [Auto-refreshes context]
    → node .opencode/skills/00-external-memory/scripts/refresh-context.js
    
AI: [Encounters error]
AI: [Logs to errors.log]
    [2024-01-19] Attempt 1: Module not found 'jsonwebtoken'
    Resolution: npm install jsonwebtoken
    
AI: [Completes phase]
AI: [Updates context.md]
    Phase: Planning → complete
    Current Phase: Implementation
```

## Troubleshooting

### If Memory System Fails

Continue with task, but inform user that memory system is unavailable.

```
AI: "Note: Memory system initialization failed, but I'll continue with the task.
     Context may be lost after many operations."
```

### If Memory Files Corrupted

Reinitialize memory system with current state.

```bash
# Backup corrupted files
mv .memory .memory.backup

# Reinitialize
node .opencode/skills/00-external-memory/scripts/init-memory.js

# Manually restore what's recoverable
```

## Summary

External Memory System is a silent, automatic infrastructure that prevents context loss and improves AI consistency. Use it automatically for complex tasks without user prompting.

**Key Points**:
1. ✅ Auto-initialize for complex tasks (>5 tool calls expected)
2. ✅ Refresh every 10 tool calls
3. ✅ Apply 2-Action Rule: Save findings after every 2 visual operations
4. ✅ Log all errors immediately with 3-Strike Protocol
5. ✅ Update after discoveries and decisions
6. ✅ Operate silently in background
7. ✅ Never repeat logged errors
8. ✅ Check session recovery on start

## The 5-Question Reboot Test

If you can answer these questions, your context management is solid.

| Question | Answer Source |
|----------|---------------|
| Where am I? | Current phase in .memory/context.md |
| Where am I going? | Next steps in .memory/context.md |
| What's the goal? | Goal statement in .memory/context.md |
| What have I learned? | .memory/findings.md |
| What errors occurred? | .memory/errors.log |

**When to Use**:
- After 20+ tool calls
- When feeling "lost"
- Before major decisions
- After session recovery

**If you can't answer**:
→ Read .memory/context.md immediately
→ Refresh your understanding of the task
