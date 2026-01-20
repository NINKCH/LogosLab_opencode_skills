## Complete Skills List

### 00 Series - System Utilities

| #  | Role Name           | Description                        | Command           |
|----|---------------------|------------------------------------|-------------------|
| 00 | **View All Skills** | List all available skills          | `view-all-skills` |
| 00 | **Disaster Recovery** | Auto-snapshot and rollback system  | Auto-triggered    |
| 00 | **External Memory**   | File-based long-term memory system | Auto-triggered    |

### 01-08 Series - Development Skills

| #  | Role Name             | Description                                                 | Command                                 |
|----|-----------------------|-------------------------------------------------------------|-----------------------------------------|
| 01 | **Product Manager**   | Requirements, architecture design, and tech stack selection | `skill({ name: "product-manager" })`    |
| 02 | **UI Prompt Designer**| Create AI-ready design prompts from documentation           | `skill({ name: "ui-prompt-designer" })` |
| 03 | **UI Generator**      | Generate UI mockups and prototypes with AI models           | `skill({ name: "ui-generator" })`       |
| 04 | **Frontend Engineer** | Modern web development (React/Vue/Next.js)                  | `skill({ name: "frontend-engineer" })`  |
| 05 | **Full-stack Engineer**| Backend development and continuous iteration                | `skill({ name: "fullstack-engineer" })` |
| 06 | **Test Engineer**     | TDD/BDD and unit/integration/E2E testing                    | `skill({ name: "test-engineer" })`      |
| 07 | **Code Reviewer**     | Quality assurance, security analysis, and best practices    | `skill({ name: "code-reviewer" })`      |
| 08 | **Branch Manager**    | Workflow optimization, conflict resolution, and release management | `skill({ name: "branch-manager" })`     |

------

## Detailed Introduction

### 0️⃣ View All Skills

**Role Characteristics**: System utility, dynamic discovery

**Core Capabilities**:

- 📋 **Dynamic Discovery** - Automatically scans `.opencode/skills/` directory
- 🔍 **Smart Search** - Search skills by name and description
- 📊 **Multiple Formats** - Supports table, JSON, and Markdown formats
- 🔄 **Real-time Updates** - Automatically reflects after adding/removing skills

**Usage**:

```bash
# In OpenCode
view-all-skills

# Use script
node .opencode/skills/00-view-all-skills/scripts/list-skills.js

# Advanced features
node .opencode/skills/00-view-all-skills/scripts/list-skills.js --format=json
node .opencode/skills/00-view-all-skills/scripts/list-skills.js --search="frontend"
```

------

### 0️⃣ Disaster Recovery System

**Role Characteristics**: Infrastructure, auto-trigger, silent execution

**Core Capabilities**:

- 🔒 **Auto Snapshot** - Automatically creates Git Stash snapshots before file operations
- 🔄 **One-click Rollback** - Instantly restore to safe state on failure
- 📋 **Snapshot Management** - View, restore, and delete historical snapshots
- ⚡ **Smart Optimization** - Reuse snapshots within 5 minutes to avoid duplication
- 💾 **Zero Cost** - Based on Git Stash, no extra space required

**Auto-trigger Timing**:

- Before executing file operations like `fsWrite`, `strReplace`, `deleteFile`
- Before batch file modifications
- Before code refactoring

**Manual Commands**:

```bash
# View all snapshots
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js list

# Rollback to latest snapshot (delete snapshot)
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js rollback 0

# Restore snapshot (keep snapshot)
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js restore 0

# Manually create snapshot
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js create "description"

# Delete snapshot
node .opencode/skills/00-disaster-recovery/scripts/snapshot.js delete 0
```

**Usage Example**:

```
User: "Help me refactor this module"
AI: [Auto-create snapshot] Snapshot created
AI: [Execute refactoring]
AI: Refactoring complete, rollback anytime if needed

User: "There's a problem, rollback"
AI: [Execute rollback] Rolled back to pre-refactoring state
```

**Notes**:

- Must be used within a Git repository
- Snapshots only save tracked file changes
- Automatically keeps latest 10 snapshots
- AI automatically invokes, no manual trigger needed

------

### 0️⃣ External Memory System

**Role Characteristics**: Infrastructure, auto-trigger, background execution

**Core Capabilities**:

- 🧠 **Persistent Memory** - Uses filesystem as external long-term memory
- 🔄 **Auto-Refresh** - Re-reads context every 10 tool calls to prevent "lost in the middle"
- 📝 **Error Tracking** - Logs all errors to prevent repetition
- 💾 **Session Recovery** - Recovers context after `/clear` or restart
- 🎯 **Goal Retention** - Keeps original goals accessible even after 50+ tool calls

**Core Concept**:

```
Context Window = RAM (volatile, limited)
Filesystem = Disk (persistent, unlimited)

→ Important information gets written to disk automatically
```

**Memory Files**:

| File                   | Purpose                           |
| ---------------------- | --------------------------------- |
| `.memory/context.md`   | Current task context and goals    |
| `.memory/findings.md`  | Discoveries and research notes    |
| `.memory/decisions.md` | Technical decisions and rationale |
| `.memory/errors.log`   | Error history                     |

**Auto-trigger Rules**:

1. **Task Start** - Creates memory files if they don't exist
2. **Every 10 Tool Calls** - Re-reads context to refresh attention
3. **Error Occurs** - Logs error to prevent repetition
4. **File Modified** - Updates relevant memory files
5. **Session Start** - Checks for previous session context

**Manual Commands**:

```bash
# Initialize memory system
node .opencode/skills/00-external-memory/scripts/init-memory.js

# Manually refresh context
node .opencode/skills/00-external-memory/scripts/refresh-context.js

# Recover from previous session
node .opencode/skills/00-external-memory/scripts/recover-session.js

# Check memory system status
node .opencode/skills/00-external-memory/scripts/memory-status.js
```

**Benefits**:

- ✅ Prevents context loss after 50+ tool calls
- ✅ Reduces hallucination by grounding in written facts
- ✅ Enables learning from past errors
- ✅ Improves consistency through documented decisions
- ✅ Seamless session continuity after interruptions

**Notes**:

- Memory files are created in `.memory/` directory
- System runs automatically in background
- Does not interfere with normal project workflow
- AI automatically invokes, no manual trigger needed

------

### 1️⃣ Product Manager

**Role Characteristics**: Strategic, highly analytical, user-centered

**Core Capabilities**:

- 📝 Requirements gathering and PRD document generation
- 🏗️ System architecture design
- 🔧 Tech stack selection and evaluation
- 📊 Existing project analysis and improvement suggestions
- 🎯 Feature planning and prioritization

**Use Cases**:

```javascript
skill({ name: "product-manager" })
```

- "Help me create a complete PRD for an e-commerce platform"
- "Analyze this project and suggest architecture improvements"
- "Design technical architecture for a real-time chat application"
- "Evaluate the pros and cons of using React vs Vue"

**Helper Tools**:

- `scripts/generate-prd.js` - PRD generator
- `templates/prd-template.md` - PRD template
- `templates/tech-design-template.md` - Technical design template

------

### 2️⃣ UI Prompt Designer

**Role Characteristics**: Understands design principles and AI model capabilities

**Core Capabilities**:

- 🎨 Convert requirement documents to AI-ready design prompts
- 🖼️ Supports Midjourney, DALL-E 3, Stable Diffusion
- 📐 Define visual style, layout, and component structure
- ♿ Includes responsive and accessibility considerations

**Use Cases**:

```javascript
skill({ name: "ui-prompt-designer" })
```

- "Create design prompts for a dashboard based on this PRD"
- "Generate Midjourney prompts for a mobile app login page"
- "Design UI prompts for an e-commerce product page"

**Output Example**:

```
Modern web dashboard design

Visual Style:
- Design system: Material Design 3
- Colors: Primary #1976D2, Secondary #424242
- Typography: Roboto, 24px/600 headings

Layout:
- Sidebar navigation + main content
- Card-based layout with 16px spacing
- Responsive: Desktop-first, mobile < 768px

Components:
- Top app bar with search
- Stat cards (4 in row)
- Data table with pagination

```javascript
skill({ name: "ui-generator" })
```

```javascript
skill({ name: "frontend-engineer" })
```

- "Build a dashboard with React + TypeScript + Tailwind"
- "Create a Vue 3 component library"
- "Set up Next.js project and implement authentication"

**Tech Stack**:

```javascript
{
  "framework": "React 18+ / Vue 3 / Next.js 14+",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "state": "Zustand / Redux Toolkit / Pinia",
  "testing": "Vitest / Jest + React Testing Library"
}
```

------

### 5️⃣ Full-stack Engineer

**Role Characteristics**: Backend and DevOps all-rounder

**Core Capabilities**:

- 🔌 REST/GraphQL API development
- 🗄️ Database design (PostgreSQL, MongoDB, MySQL)
- 🔐 Authentication and authorization
- 🐳 Docker and Kubernetes
- 🚀 CI/CD pipelines
- 📈 System architecture and scaling

**Use Cases**:

```javascript
skill({ name: "fullstack-engineer" })
```

- "Build REST API with Express + PostgreSQL"
- "Design database architecture for a social media app"
- "Set up Docker and CI/CD pipeline"

**Tech Stack**:

```javascript
{
  "backend": "Express / FastAPI / Spring Boot",
  "database": "PostgreSQL / MongoDB",
  "cache": "Redis",
  "queue": "RabbitMQ / Kafka",
  "container": "Docker",
  "orchestration": "Kubernetes",
  "ci_cd": "GitHub Actions / GitLab CI"
}

```

------

### 6️⃣ Test Engineer

**Role Characteristics**: TDD/BDD practice specialist

**Core Capabilities**:

- 🔴🟢🔵 Test-driven development (RED-GREEN-REFACTOR)
- 🧪 Unit, integration, and E2E testing
- 📊 Test coverage analysis
- 🎭 Vitest, Jest, Playwright, Cypress
- 🔄 CI/CD integration

**Use Cases**:

```javascript
skill({ name: "test-engineer" })
```

- "Write unit tests for this component using TDD"
- "Create E2E tests for login flow"
- "Set up test coverage reporting"

**Testing Pyramid**:

```
     /\
    /  \    E2E (10%)
   /----\   
  /      \  Integration (20%)
 /--------\ 
/__________\ Unit (70%)
```

**Helper Tools**:

- `templates/test-template.ts` - Test template
- `scripts/test-runner.js` - Test runner

------

### 7️⃣ Code Reviewer

**Role Characteristics**: Quality assurance and security specialist

**Core Capabilities**:

- 🔍 Code quality and maintainability review
- 🔒 Security vulnerability detection (SQL injection, XSS, CSRF)
- ⚡ Performance optimization suggestions
- 🏛️ Architecture and design pattern validation
- 📋 Best practices enforcement

**Use Cases**:

```javascript
skill({ name: "code-reviewer" })
```

- "Review this PR for security issues"
- "Analyze code performance bottlenecks"
- "Check if SOLID principles are followed"

**Review Levels**:

- 🔴 **Critical**: Security vulnerabilities, data loss, memory leaks
- 🟡 **Major**: Performance issues, error handling, architecture violations
- 🔵 **Minor**: Naming, code style, documentation

**Helper Tools**:

- `scripts/review-checklist.md` - Complete review checklist

------

### 8️⃣ Branch Manager

**Role Characteristics**: Git workflow specialist

**Core Capabilities**:

- 🌿 Implement branching strategies (Git Flow, GitHub Flow, Trunk-Based)
- 🔀 Resolve merge conflicts
- 🏷️ Semantic versioning and release management
- 📝 Enforce branch naming conventions
- 🛡️ Branch protection rules setup

**Use Cases**:

```javascript
skill({ name: "branch-manager" })
```

- "Help me resolve this merge conflict"
- "Create release branch for v1.2.0"
- "Set up Git Flow for the project"

**Branching Models**:

```
Git Flow:
main → develop → feature/bugfix/hotfix

GitHub Flow:
main → feature branches

Trunk-Based:
main → short-lived features (< 2 days)
```

**Helper Tools**:

- `scripts/create-branch.js` - Create feature branches