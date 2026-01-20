# Examples: External Memory System in Action

## Example 1: Building a REST API (Complex Task)

**User Request**: "Build a REST API with JWT authentication"

### Auto-Initialization (Silent)

```javascript
// AI detects complex task (>5 tool calls expected)
// Silently runs: node .opencode/skills/00-external-memory/scripts/init-memory.js
// Creates .memory/ directory with initial files
```

### Tool Call 1-5: Research Phase

```
Call 1: Search "JWT authentication best practices"
Call 2: Read documentation
→ 2-Action Rule triggered! Update .memory/findings.md
Call 3: Search "Express.js JWT middleware"
Call 4: Read middleware docs
→ 2-Action Rule triggered! Update .memory/findings.md
Call 5: Plan architecture
```

**.memory/findings.md** (auto-updated):
```markdown
| JWT uses HS256 algorithm | jwt.io/docs | 2024-01-19 | Auth implementation |
| Express has jsonwebtoken lib | npmjs.com/package/jsonwebtoken | 2024-01-19 | Middleware |
```

### Tool Call 10: Auto-Refresh

```
Call 10 reached!
→ Auto-refresh: Read .memory/context.md
→ Goals brought back into attention window
```

### Tool Call 15: Error Occurs

```
Call 15: npm install jsonwebtoken
Error: Module not found

→ Log to .memory/errors.log
[2024-01-19 10:30:00] Attempt 1: Module 'jsonwebtoken' not found
Resolution: Run npm install first
```

### Tool Call 16: Different Approach (3-Strike Protocol)

```
Call 16: Check .memory/errors.log
→ See previous error
→ Try different approach: npm install jsonwebtoken
Success!
```

### Tool Call 20: Auto-Refresh Again

```
Call 20 reached!
→ Auto-refresh: Read .memory/context.md
→ Still on track with original goal
```

---

## Example 2: The 2-Action Rule in Practice

**User Request**: "Research the best database for this project"

### Visual Operations Tracking

```
Operation 1: Fetch PostgreSQL documentation
Operation 2: Read features page
→ 2-Action Rule! MUST update .memory/findings.md NOW

[AI silently updates findings.md]

Operation 3: Fetch MongoDB documentation
Operation 4: Read features page
→ 2-Action Rule! MUST update .memory/findings.md NOW

[AI silently updates findings.md]
```

**.memory/findings.md**:
```markdown
## Visual/Browser Findings

- PostgreSQL: ACID compliant, supports JSON, strong consistency
  Source: postgresql.org/docs
  Date: 2024-01-19
  
- MongoDB: Document-based, flexible schema, horizontal scaling
  Source: mongodb.com/docs
  Date: 2024-01-19
```

**Why This Matters**: Without the 2-Action Rule, this visual information would be lost after a few more tool calls.

---

## Example 3: Error Recovery with 3-Strike Protocol

**User Request**: "Fix the login bug"

### Attempt 1: Diagnose & Fix

```
Call 1: Read auth.js
Call 2: Identify issue - missing await
Call 3: Fix by adding await
Call 4: Test
Error: Still failing - different error now

→ Log to .memory/errors.log
[2024-01-19] Attempt 1: TypeError - Cannot read property 'token'
Resolution: Added await, but still failing
```

### Attempt 2: Alternative Approach

```
Call 5: Check .memory/errors.log
→ See Attempt 1 failed
Call 6: Try different approach - check if user object exists
Call 7: Add null check before accessing token
Call 8: Test
Error: Still failing - token is undefined

→ Log to .memory/errors.log
[2024-01-19] Attempt 2: Token is undefined
Resolution: Added null check, but token still undefined
```

### Attempt 3: Broader Rethink

```
Call 9: Check .memory/errors.log
→ See 2 attempts failed
Call 10: Auto-refresh context.md
→ Re-read original goal
Call 11: Search for similar issues
Call 12: Find that token should come from request headers
Call 13: Fix by reading from req.headers.authorization
Call 14: Test
Success!

→ Log to .memory/errors.log
[2024-01-19] Attempt 3: Token should come from headers
Resolution: Read from req.headers.authorization - FIXED
```

---

## Example 4: Session Recovery After /clear

**Scenario**: User runs `/clear` command, context is lost

### Session Start

```javascript
// AI checks if .memory/ exists
if (fs.existsSync('.memory/')) {
  // Run session recovery
  exec('node .opencode/skills/00-external-memory/scripts/session-recovery.js');
}
```

**Output**:
```
[external-memory] SESSION RECOVERY DETECTED
Previous session: session-2024-01-19
Last memory update: context.md at message #45
Unsynced messages: 8

--- UNSYNCED CONTEXT ---
USER: Can you add error handling?
AI: I'll add try-catch blocks to the auth middleware
  Tools: strReplace: src/auth/middleware.js
USER: Also add logging
AI: Adding winston logger for error tracking
  Tools: fsWrite: src/utils/logger.js

--- RECOMMENDED ACTIONS ---
1. Run: git diff --stat
2. Read: .memory/context.md, .memory/findings.md
3. Update memory files based on above context
4. Continue with task
```

### AI Response

```
AI: [Silently reads .memory/context.md]
AI: [Silently reads .memory/findings.md]
AI: [Silently reads git diff]
AI: "I see we were adding error handling and logging. Let me continue..."
```

---

## Example 5: The 5-Question Reboot Test

**After 30 tool calls, AI checks understanding**:

```
Question 1: Where am I?
→ Read .memory/context.md
Answer: Phase 3 - Implementation

Question 2: Where am I going?
→ Read .memory/context.md
Answer: Next steps: Add tests, deploy to staging

Question 3: What's the goal?
→ Read .memory/context.md
Answer: Build REST API with JWT authentication

Question 4: What have I learned?
→ Read .memory/findings.md
Answer: JWT uses HS256, Express has jsonwebtoken lib

Question 5: What errors occurred?
→ Read .memory/errors.log
Answer: Module not found (fixed), token undefined (fixed)
```

**Result**: AI is fully oriented and can continue confidently.

---

## Example 6: Silent Operation (Good vs Bad)

### ❌ Bad: Announcing Every Update

```
AI: "I'm now updating the memory system with this finding..."
AI: "Writing to .memory/findings.md..."
AI: "Memory file updated successfully..."
AI: "Now I'll continue with the task..."
AI: "I found that the API uses JWT authentication..."
```

**Problem**: Too verbose, distracts from actual work.

### ✅ Good: Silent Background Operation

```
AI: [Silently updates .memory/findings.md]
AI: "I found that the API uses JWT authentication. Let me implement that..."
```

**Result**: Clean, focused conversation.

---

## Example 7: Decision Documentation

**User Request**: "Choose between PostgreSQL and MongoDB"

### Decision Making Process

```
Call 1: Research PostgreSQL
Call 2: Research MongoDB
→ 2-Action Rule: Update findings.md

Call 3: Compare features
Call 4: Make decision
→ Update .memory/decisions.md
```

**.memory/decisions.md**:
```markdown
| Use PostgreSQL | Need ACID transactions, relational data, strong consistency | 2024-01-19 |
```

**Later (Call 50)**:
```
User: "Why did we choose PostgreSQL?"
AI: [Reads .memory/decisions.md]
AI: "We chose PostgreSQL because we need ACID transactions and strong consistency for relational data."
```

---

## Example 8: Never Repeat Failures

### ❌ Wrong: Repeating Same Action

```
Call 1: Read config.json
Error: File not found

Call 2: Read config.json  # Same action!
Error: File not found

Call 3: Read config.json  # Still same action!
Error: File not found
```

### ✅ Correct: Mutating Approach

```
Call 1: Read config.json
Error: File not found
→ Log to .memory/errors.log

Call 2: Check .memory/errors.log
→ See previous error
→ Try different approach

Call 3: List directory to check if file exists
Result: File doesn't exist

Call 4: Create default config.json
Success!

Call 5: Read config.json
Success!
```

---

## Key Takeaways

1. **Auto-Initialization**: System activates silently for complex tasks
2. **2-Action Rule**: Visual information captured as text immediately
3. **10-Call Refresh**: Goals stay in attention window
4. **3-Strike Protocol**: Systematic error recovery
5. **Session Recovery**: Work continues after context loss
6. **Silent Operation**: Updates happen in background
7. **Never Repeat**: Check error log before retrying

These examples show how the external memory system prevents context loss, reduces errors, and enables AI to handle complex, long-running tasks effectively.
