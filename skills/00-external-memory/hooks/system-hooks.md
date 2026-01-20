# External Memory System Hooks

> This document describes how the `00-external-memory` system skill hooks into the agent lifecycle to provide persistent memory, without interrupting the foreground workflow.

---

## 1. General Principles

- This is a **background system skill**. It runs silently and MUST NOT ask interactive questions.
- All hooks described here are executed automatically by the agent when certain events occur.
- Foreground interaction (explaining memory content, cleaning memory, etc.) only happens when the user explicitly asks.

---

## 2. Session Initialization Hook

**Event**: Agent starts in a project OR attaches to a workspace.

**Behavior**:

1. **Ensure `.memory/` directory exists**
   - If `.memory/` does not exist at project root, create it.
   - Initialize memory files according to the templates:
     - `.memory/context.md`
     - `.memory/findings.md`
     - `.memory/decisions.md`
     - `.memory/errors.log`
     - `.memory/session.json` (if used by the implementation)

2. **Load existing memory**
   - If the files already exist, read their contents and use them to reconstruct:
     - Current or recent tasks and goals
     - Important discoveries and design decisions
     - Historical errors and known pitfalls
   - This reconstruction happens entirely in the agent's internal state and does not produce foreground messages.

---

## 3. Post-Tool-Call Hook

**Event**: The agent finishes a tool call (any tool).

**Behavior**:

1. Maintain a counter of tool calls.
2. When the count reaches the threshold defined in `SKILL.md` (e.g. every 10 calls), perform a **memory refresh**:
   - Re-read key memory files from `.memory/` (especially `context.md`, `findings.md`, `decisions.md`).
   - Update the agent's internal focus so that long-term goals and past decisions remain accessible.
3. Reset the counter after refresh.

The refresh is fully silent and does not appear in the chat as a separate message.

---

## 4. Post-File-Operation Hook

**Event**: The agent successfully modifies project files (write, replace, delete, refactor).

**Behavior**:

1. **Analyze significance**
   - Determine whether the change represents:
     - A new or updated **technical decision**;
     - An important **discovery** (e.g. behavior of an API, constraints found during debugging);
     - Long-term relevant **context** that will matter in future steps.

2. **Write to memory files**
   - For decisions, append a short, dated entry to `.memory/decisions.md`.
   - For discoveries, append a short summary to `.memory/findings.md`.
   - Optionally update `.memory/context.md` if the overall task context has significantly changed.

All writes MUST be incremental (append or small targeted edits) to keep the memory files readable.

---

## 5. Post-Error Hook

**Event**: A tool call, script, or command fails (non-zero exit code, thrown error, etc.).

**Behavior**:

1. **Append error record**
   - Append a structured entry to `.memory/errors.log`, including at least:
     - Timestamp
     - Operation / command
     - Error message
     - Relevant stack trace or output (if available)

2. **Optional: summarize recurring issues**
   - If the same error pattern is seen repeatedly, summarize it as a "lesson learned" in `.memory/decisions.md`, e.g.:
     - "Avoid using command X in environment Y because it causes Z problem."

Again, these steps are executed silently and do not interrupt the foreground conversation.

---

## 6. Foreground Interaction Triggers

Although this is a background system skill, it may surface to the foreground **only when explicitly requested by the user**, for example:

- "Show me the current context memory"
- "Summarize recent decisions from memory"
- "Clean or reset external memory"

In such cases, the skill may explain what it will read or modify, and ask for confirmation if destructive operations are requested (e.g. clearing memory files).

At all other times, the hooks in this document operate silently in the background.
