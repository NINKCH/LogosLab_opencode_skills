# OpenCode Development Skills

A complete set of professional AI agent skills covering the entire software development lifecycle from requirements to deployment, including 3 systems and tools and 8 development skills.

Project name: `LogosLab_opencode_skills`

---

## Quick Start

### Installation

**Recommended: Project-level Installation (Git or manual)**

1. **Create `.opencode` directory in your project root**:

```bash
# Linux/Mac
mkdir -p .opencode

# Windows
mkdir .opencode
```

2. **Install skills into `.opencode`**:

```bash
cd .opencode
git clone https://github.com/NINKCH/LogosLab_opencode_skills.git .
```

> Or download the repository as ZIP and extract all contents into the `.opencode` directory.

**Directory Structure**:
```
your-project/
├── .opencode/
│   └── skills/
│       ├── 00-disaster-recovery/
│       ├── 00-external-memory/
│       ├── 00-view-all-skills/
│       ├── 01-product-manager/
│       ├── 02-ui-prompt-designer/
│       └── ...
├── src/
└── package.json
```

**Note**: OpenCode will automatically discover all skills in the `.opencode/skills/` directory.

---

### View All Skills

In OpenCode, use the following command to view all available agent skills:

```
view-all-skills
```

### Project Initialization

In OpenCode chat, you can initialize system-level skills for the current project by calling this command:

```text
init_project
```

The concrete initialization behavior follows the rules defined in each system skill's `SKILL.md` and hooks (e.g. `00-disaster-recovery`, `00-external-memory`).

### Load a Skill

**Method 1: Simple Invocation**
```javascript
skill({ name: "skill-name" })
```

**Method 2: With Description (Recommended)**
```javascript
skill({ name: "skill-name" })
Describe what you want to do

// Or on the same line
skill({ name: "skill-name" }) Describe what you want to do
```

**Examples**:
```javascript
// Simple invocation
skill({ name: "product-manager" })

// With description (more efficient)
skill({ name: "product-manager" })
Help me create a PRD for an e-commerce platform

skill({ name: "frontend-engineer" }) Build a dashboard with React
```

**Tips**:
- Calling with description helps skills understand your needs faster
- Description can be on the same line or on a new line

---

## Complete Workflow

### New Project Workflow

```
1. Product Manager → Gather requirements, create PRD, design architecture
   skill({ name: "product-manager" })
   "Create PRD for task management app"

2. UI Prompt Designer → Convert PRD to design prompts
   skill({ name: "ui-prompt-designer" })
   "Create UI design prompts based on PRD"

3. UI Generator → Generate UI mockups
   skill({ name: "ui-generator" })
   "Generate interface mockups using Midjourney"

4. Branch Manager → Initialize Git workflow
   skill({ name: "branch-manager" })
   "Set up Git Flow and create develop branch"

5. Frontend Engineer + Full-stack Engineer → Parallel development
   skill({ name: "frontend-engineer" })
   "Build frontend with React + TypeScript"
   
   skill({ name: "fullstack-engineer" })
   "Build API with Express + PostgreSQL"

6. Test Engineer → Write tests
   skill({ name: "test-engineer" })
   "Write unit and integration tests using TDD"

7. Code Reviewer → Review code
   skill({ name: "code-reviewer" })
   "Review code quality and security"

8. Branch Manager → Merge and release
   skill({ name: "branch-manager" })
   "Merge to main and create v1.0.0 release"
```

### Feature Development

```
1. Product Manager → Analyze requirements
2. Branch Manager → Create feature branch
3. Test Engineer → Write tests first (TDD)
4. Frontend/Full-stack Engineer → Implement feature
5. Code Reviewer → Review code
6. Branch Manager → Merge branch
```

### Bug Fix Workflow

```
1. Branch Manager → Create hotfix branch
2. Test Engineer → Write reproduction test
3. Full-stack Engineer → Fix bug
4. Code Reviewer → Review fix
5. Branch Manager → Merge and tag version
```

---

## Usage Tips

### 1. Use Skills Individually

```javascript
// Only need code review
skill({ name: "code-reviewer" })
"Review this PR"

// Only need to write tests
skill({ name: "test-engineer" })
"Write unit tests for this function"
```

### 2. Combine Skills

```javascript
// Load multiple skills simultaneously
skill({ name: "test-engineer" })
skill({ name: "code-reviewer" })

"Write tests for this component and review implementation"
```

### 3. Use Helper Scripts

```bash
# Generate PRD
node .opencode/skills/01-product-manager/scripts/generate-prd.js

# Create feature branch
node .opencode/skills/08-branch-manager/scripts/create-branch.js

# Run tests
node .opencode/skills/06-test-engineer/scripts/test-runner.js

# View all skills
node .opencode/skills/00-view-all-skills/scripts/list-skills.js
```

### 4. Use Templates

```bash
# Copy PRD template
cp .opencode/skills/01-product-manager/templates/prd-template.md docs/

# Copy test template
cp .opencode/skills/06-test-engineer/templates/test-template.ts src/__tests__/

# View review checklist
cat .opencode/skills/07-code-reviewer/scripts/review-checklist.md
```

---

## Extending Skills

### Adding New Skills

1. **Create skill directory**:
```bash
# Use next sequence number (e.g., 09)
# Linux/Mac
mkdir -p .opencode/skills/09-my-new-skill

# Windows
mkdir .opencode\skills\09-my-new-skill
```

2. **Create SKILL.md**:
```yaml
---
name: my-new-skill
description: My custom skill description
license: MIT
compatibility: opencode
metadata:
  role: Custom Role
  workflow: custom-workflow
  language: english
---

# My New Skill

[Add your skill content here]
```

3. **Verify skill**:
```bash
view-all-skills
# Or run script
node .opencode/skills/00-view-all-skills/scripts/list-skills.js
```

### Removing Skills

1. **Delete skill directory**:
```bash
# Linux/Mac
rm -rf .opencode/skills/09-skill-to-remove

# Windows
rmdir /s /q .opencode\skills\09-skill-to-remove
```

2. **Verify removal**:
```bash
view-all-skills
```

---

## Project Structure

```
.opencode/skills/
├── 00-disaster-recovery/          # Disaster recovery system (auto-triggered)
│   ├── SKILL.md
│   ├── AI-INSTRUCTIONS.md
│   ├── hooks/
│   │   └── pre-file-operation.md
│   └── scripts/
│       ├── auto-snapshot.js       # Auto-snapshot script (AI auto-invokes)
│       └── snapshot.js            # Manual snapshot management
│
├── 00-external-memory/            # External memory system (auto-triggered)
│   ├── SKILL.md
│   ├── AI-INSTRUCTIONS.md
│   ├── README.md
│   ├── scripts/
│   │   ├── init-memory.js         # Initialize memory
│   │   ├── refresh-context.js     # Refresh context
│   │   ├── recover-session.js     # Recover session
│   │   └── memory-status.js       # Memory status
│   └── templates/
│       ├── context-template.md
│       ├── findings-template.md
│       └── decisions-template.md
│
├── 00-view-all-skills/
│   ├── SKILL.md
│   └── scripts/list-skills.js
│
├── 01-product-manager/
│   ├── SKILL.md
│   ├── templates/
│   │   ├── prd-template.md
│   │   └── tech-design-template.md
│   └── scripts/generate-prd.js
│
├── 02-ui-prompt-designer/
│   └── SKILL.md
│
├── 03-ui-generator/
│   └── SKILL.md
│
├── 04-frontend-engineer/
│   └── SKILL.md
│
├── 05-fullstack-engineer/
│   └── SKILL.md
│
├── 06-test-engineer/
│   ├── SKILL.md
│   ├── templates/test-template.ts
│   └── scripts/test-runner.js
│
├── 07-code-reviewer/
│   ├── SKILL.md
│   └── scripts/review-checklist.md
│
└── 08-branch-manager/
    ├── SKILL.md
    └── scripts/create-branch.js
```

---

## Quick Examples

### Example 1: Create Todo App

```javascript
// 1. Create PRD
skill({ name: "product-manager" })
"Create PRD for Todo app"

// 2. Design UI
skill({ name: "ui-prompt-designer" })
"Create design prompts for Todo app"

// 3. Build frontend
skill({ name: "frontend-engineer" })
"Build Todo app with React + TypeScript"

// 4. Write tests
skill({ name: "test-engineer" })
"Write tests for Todo components"
```

### Example 2: Add Authentication

```javascript
// 1. Design feature
skill({ name: "product-manager" })
"Design user authentication feature"

// 2. Create branch
skill({ name: "branch-manager" })
"Create feature/auth branch"

// 3. Implement backend
skill({ name: "fullstack-engineer" })
"Implement JWT authentication"

// 4. Review code
skill({ name: "code-reviewer" })
"Review authentication implementation security"
```

### Example 3: Fix Bug

```javascript
// 1. Create hotfix branch
skill({ name: "branch-manager" })
"Create hotfix branch"

// 2. Write reproduction test
skill({ name: "test-engineer" })
"Write a test that reproduces the bug"

// 3. Fix and review
skill({ name: "fullstack-engineer" })
"Fix bug"

skill({ name: "code-reviewer" })
"Review fix"
```

---

## Features

- **Complete Coverage**: Full development lifecycle from requirements to deployment
- **English Support**: English documentation and instructions
- **Cross-platform**: Windows and Linux/Mac script support
- **Practical Tools**: Ready-to-use scripts and templates
- **Best Practices**: TDD, Git Flow, SOLID, security
- **Seamless Integration**: Skills work together seamlessly
- **Auto-triggered Infrastructure**: Disaster recovery and external memory run automatically

---

## Notes

1. **Skill Auto-discovery**: Place `.opencode/skills/` directory in project root, OpenCode will automatically discover all skills
2. **On-demand Loading**: Skills are automatically activated when relevant, or can be manually loaded
3. **Script Permissions**: Linux/Mac users need to add execute permissions to `.sh` scripts: `chmod +x script.sh`
4. **Customization**: Edit individual `SKILL.md` files to customize skill behavior
5. **Infrastructure Skills**: 00-series skills (disaster recovery, external memory) run automatically in background
6. **Memory Files**: Don't delete `.memory/` folder - it's your AI's long-term memory

---

## Acknowledgments

Inspired by:
- [Anthropic/skills](https://github.com/anthropics/skills) - Official Claude skills
- [obra/superpowers](https://github.com/obra/superpowers) - Agentic skills framework
- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) - Curated skills
- [Manus Memory Principles](https://github.com/manus-ai) - External memory system design

---

<div align="center">

**🚀 Start building amazing software with OpenCode Skills!**

</div>
