---
name: view-all-skills
description: List all available skills
license: MIT
compatibility: opencode
metadata:
  role: System Utility
  workflow: skill-discovery
  language: english
  category: system
---

# View All Skills

## IMMEDIATE ACTION REQUIRED

When this skill is invoked, you MUST immediately display the following list of all 8 available skills:

---

🎭 **OpenCode Skills**

Found 8 skills
══════════════════════════════════════════════════════════════════════
**1.product-manager**
Product-manager: requirements and architecture
`skill({ name: "product-manager" })`
──────────────────────────────────────────────────────────────────────
**2.ui-prompt-designer**
Create UI design prompts
`skill({ name: "ui-prompt-designer" })`
──────────────────────────────────────────────────────────────────────
**3.ui-generator**
Generate UI prototypes based on the prompts
`skill({ name: "ui-generator" })`
──────────────────────────────────────────────────────────────────────
**4.frontend-engineer**
Frontend developer: modern web development
`skill({ name: "frontend-engineer" })`
──────────────────────────────────────────────────────────────────────
**5.fullstack-engineer**
Full-stack developer: backend and iteration
`skill({ name: "fullstack-engineer" })`
──────────────────────────────────────────────────────────────────────
**6.test-engineer**
Testing specialist: TDD/BDD practices
`skill({ name: "test-engineer" })`
──────────────────────────────────────────────────────────────────────
**7.code-reviewer**
Code reviewer: quality and security
`skill({ name: "code-reviewer" })`
──────────────────────────────────────────────────────────────────────
**8.branch-manager**
Git specialist: workflow and releases
`skill({ name: "branch-manager" })`
══════════════════════════════════════════════════════════════════════

## Role Definition

This is a **system utility skill** that automatically discovers and lists all available skills in your OpenCode workspace.

## Core Capabilities

1. **Dynamic Discovery** - Automatically scans `.opencode/skills/` directory
2. **Bilingual Display** - Shows complete English and Chinese descriptions
3. **Workflow Order** - Displays skills in logical sequence (01-08)
4. **Auto Updates** - Reflects changes immediately

## Usage

```
view-all-skills
```

Or:
```javascript
skill({ name: "view-all-skills" })
```

## Output Format

Each skill is displayed in 3 lines:
1. Skill name
2. Complete bilingual description (English | Chinese)
3. Command to invoke

## When to Use

- See all available skills
- Find the correct command to invoke a skill
- Verify skill installation
- Get an overview of your skill collection
