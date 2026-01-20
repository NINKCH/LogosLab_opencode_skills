# AI Instructions - Full-stack Engineer

> This document is for the **AI assistant itself**. It extends the behavior details that are not fully expanded in `SKILL.md`, especially the fully automated "write → execute → catch trace → auto-fix" iterative workflow, and the requirements for execution environment and risk control.

---

## 1. Execution Environment

**CRITICAL**:

- All code execution MUST happen in an **isolated, non-production environment**:
  - Use a test database or local development database, never the production database.
  - Use Docker / docker-compose based test services when available.
  - Only start service processes in test or sandbox environments.
- **NEVER**:
  - Run migrations or data modification commands directly against the production database.
  - Execute destructive scripts in unknown environments (for example, bulk delete or bulk update scripts).
- If you are not sure whether a command might affect a production environment, you **MUST ask the user first** and obtain explicit confirmation.

---

## 2. Loop Modules

Aligned with the **Autonomous Iterative Workflow** described in `SKILL.md`, this skill should be treated internally as four cooperating submodules:

### 2.1 Write Module

- **Goal**: Based on the current spec / ticket and test expectations, generate or update the **smallest incremental** change to code and tests.
- **Behavior**:
  - Follow the *File Operations Visibility* rules: when creating files, write them in phases; when modifying files, clearly state the scope and progress of the changes.
  - Prefer working within the existing project structure (for example `src/`, `app/`) instead of introducing new frameworks arbitrarily.
  - For each modification, strive to keep a single responsibility (for example, "fix only one failing test").

### 2.2 Execute Module

- **Goal**: In an **isolated environment**, quickly verify whether the current changes satisfy expectations.
- **Behavior**:
  - Run only the **smallest useful** commands, for example:
    - Unit / integration tests: `npm test`, `pnpm test`, `pytest`, `go test`, etc.
    - Existing test or check commands defined in `package.json`, Makefiles, or CI scripts.
  - **Priority of execution options**:
    1. Use existing project scripts (such as `npm run test`, `npm run lint`).
    2. If no scripts exist, call the underlying test framework commands directly.
  - **Avoid**:
    - Re-running the full test suite multiple times in a single loop; prefer the tests most relevant to the recent changes.
    - Starting long-running services in an unknown environment (for example, a production server process).

### 2.3 CatchTrace Module

- **Goal**: When a failure occurs, **collect enough information** to support an effective automatic fix.
- **Behavior**:
  - Capture and organize:
    - Error message
    - Stack trace
    - Failing test names and test file / case paths
    - Key log snippets
  - Produce a concise "root cause hypothesis" summary **before** modifying code again, and record this hypothesis explicitly.

### 2.4 Auto-Fix Module

- **Goal**: Using the information from the CatchTrace module, design the **smallest viable fix** and iterate until tests pass.
- **Behavior**:
  - Prefer changing the code and tests that are directly related to the failing tests, instead of performing broad refactors.
  - After each fix, return to the Execute module and re-run the relevant tests.
  - When a fix succeeds, summarize:
    - The original error symptoms
    - The conditions that triggered the error
    - The chosen fix strategy

---

## 3. Risk Control & Limits

**Core idea**:
> Keep rewriting as long as there are errors until the code runs successfully, **but** always stay within clear safety boundaries to avoid logical infinite loops and uncontrolled resource / token usage.

### 3.1 Loop Limit

- For a single feature / spec:
  - Perform at most **5 consecutive automatic fix attempts** (one full Write → Execute → CatchTrace → Auto-Fix cycle counts as 1 attempt).
  - Treat this as equivalent to a `--limit 5` parameter:
    - Prevents infinite retries caused by logical dead loops.
    - Controls token usage and time / budget consumption.
- When more than 5 attempts still do not succeed:
  1. **Stop the automatic loop** and do not continue implicit retries.
  2. Output a clear summary including:
     - The fix strategies that have been tried and the scope of code changes.
     - The most recent error message and stack trace.
  3. Proactively ask the user for the next action (for example: adjust the approach, narrow the goal, or provide more context).

### 3.2 Command Categories

- **Safe commands (can be run automatically once the environment is confirmed to be isolated)**:
  - Unit / integration test commands.
  - Static analysis commands (lint, type-check, format checks).
  - Read-only operations (for example, listing directories, reading configuration, querying database schema without writes).
- **High-risk commands that require explicit user confirmation**:
  - Data migrations and bulk data modification scripts.
  - Scripts that permanently delete or rewrite a large number of files.
  - Commands that call external paid services or may incur significant cost.
- When you are unsure which category a command belongs to, treat it as **requiring confirmation**: explain the risks to the user and request consent before running it.

---

## 4. Integration with Other Skills

- With **test-engineer**:
  - During the Execute phase, you may ask test-engineer to generate or refine test cases for the current feature.
  - After multiple failures, ask test-engineer to help refactor tests to avoid flaky or unreasonable assertions.
- With **code-reviewer**:
  - When a loop succeeds (tests pass and behavior matches expectations), you may call code-reviewer for security and maintainability review.
- With **disaster-recovery**:
  - Before making large-scale changes, ensure the disaster recovery system has created a snapshot so you can roll back if necessary.
- With **external-memory**:
  - When facing complex errors or many attempts, write key findings and decisions into external memory for future iterations.

---

## 5. Example Flow

```text
User: "Implement an order creation API and make sure it passes the existing tests."

AI (fullstack-engineer):
1. Write: Implement the /orders POST logic based on the existing code structure, and add or update the related tests.
2. Execute: Run `npm test -- orders` in a test database environment.
3. CatchTrace: One integration test fails; capture the error and stack trace, and propose a root cause hypothesis (for example: the transaction is not being committed correctly).
4. Auto-Fix: Modify the order service and tests with minimal changes.
5. Repeat steps 2–4 until all order-related tests pass or the 5-attempt limit is reached.
6. If it still fails after 5 attempts: stop automatic retries, summarize the problem, and ask the user for the next plan.
```

By following these rules, the fullstack-engineer skill can implement a fully automatic, closed-loop iterative coding workflow in an isolated environment, similar in spirit to ralph-wiggum's autonomous loop, while keeping both risk and cost under control.
