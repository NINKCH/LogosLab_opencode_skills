# OpenCode System Initialization Specification

> This document defines how the agent should initialize and manage system-level skills (00-series) and the external memory directory when a project or session starts.

---

## Project Init Command

The agent SHOULD support a simple interactive command `init_project` that initializes system-level skills for the **current project**. Its concrete behavior (directory checks, memory initialization, Git usage, etc.) MUST follow the rules defined in each system skill's `SKILL.md` and `hooks/` documents (e.g. `00-disaster-recovery`, `00-external-memory`).  

After running `init_project`, the agent SHOULD return a short, human-readable summary of the initialization status, for example:  

```text
OpenCode initialization completed!
✓ External Memory system activated
✓ Disaster Recovery system ready
```

---

## 1. Scope

- Applies to any project that contains a `.opencode/skills/` directory.  
- Focuses on **00-series system skills**, especially:
  - `00-disaster-recovery` (auto-snapshot & rollback)  
  - `00-external-memory` (file-based external memory)
  - `00-view-all-skills` is a utility and **not** auto-triggered.

---

## 2. Agent Startup Responsibilities

When the agent starts in a project (or attaches to a new workspace), it MUST perform the following steps silently in the background:  

1. **Scan skills directory**
   - Look for `.opencode/skills/` in the project root.  
   - For each subdirectory (e.g. `00-disaster-recovery`, `00-external-memory`, `01-product-manager`), read its `SKILL.md` metadata.  

2. **Identify system-level skills**
   - Any skill with directory name starting with `00-` **and** `metadata.role: Infrastructure` MUST be treated as a **system-level background skill**.  
   - Examples:  
     - `00-disaster-recovery`  
     - `00-external-memory`

3. **Register background hooks**
   - For each system skill, read its `hooks/` documentation (if present) and register the described hook points into the agent's internal lifecycle (pre-file-operation, post-file-operation, post-tool-call, etc.).  
   - All hook execution MUST be **silent** and MUST NOT call interactive question tools.  

---

## 3. Disaster Recovery Hooks

The `00-disaster-recovery` skill is responsible for **pre-operation safety** using Git-based snapshots.  

All detailed hook behavior (pre-file-operation, optional pre-command protection) is defined in `00-disaster-recovery/hooks/pre-file-operation.md` and any related hook documents under this skill.  

This SYSTEM-INIT document only establishes the global contract that:  

- Once `00-disaster-recovery` is detected and its hooks are registered, the agent MUST treat it as an always-on pre-operation safety layer.  
- All disaster-recovery hooks MUST run silently in the background and MUST NOT initiate interactive questions.  

---

## 4. External Memory Hooks

The `00-external-memory` skill is responsible for **persistent memory** across long sessions.  

All detailed trigger rules (session initialization, post-tool-call refresh, post-file-operation updates, post-error logging) are defined in `00-external-memory/SKILL.md` and the consolidated hooks document `00-external-memory/hooks/system-hooks.md`.  

This SYSTEM-INIT document only establishes the global contract that:  

- Once `00-external-memory` is detected and its hooks are registered, the agent MUST treat it as an always-on background system skill.  
- All external-memory hooks MUST run silently in the background and MUST NOT initiate interactive questions.  

---

## 5. Foreground vs Background Behavior

- **00-series system skills (e.g. disaster-recovery, external-memory)**:  
  - Automatically active once detected and registered at startup.  
  - Run primarily through hooks and background triggers.  
  - Only surface to the foreground when the user explicitly asks (e.g. manual rollback, inspect memory files, clear memory).

This separation ensures that system utilities provide safety and continuity without interrupting the normal development workflow.  
