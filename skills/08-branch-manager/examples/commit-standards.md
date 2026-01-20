# Commit Message Standards

## Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Components

- **type**: Category of change (required)
- **scope**: Area affected (optional)
- **subject**: Brief description (required)
- **body**: Detailed explanation (optional)
- **footer**: Breaking changes, issue references (optional)

## Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature or bug fix)
- `test`: Test additions/updates
- `chore`: Maintenance tasks (dependencies, build config)
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `revert`: Revert previous commit

## Examples

### Simple Commit
```bash
feat(auth): add OAuth2 authentication
```

### With Body
```bash
feat(auth): add OAuth2 authentication

Implement OAuth2 flow with Google and GitHub providers.
Includes token refresh and session management.
```

### With Footer
```bash
feat(auth): add OAuth2 authentication

Implement OAuth2 flow with Google and GitHub providers.
Includes token refresh and session management.

Closes #123
```

### Bug Fix
```bash
fix(api): resolve race condition in user creation

The user creation endpoint had a race condition when
multiple requests were made simultaneously. Added proper
locking mechanism to prevent duplicate users.

Fixes #456
```

### Breaking Change
```bash
feat(api): redesign authentication API

BREAKING CHANGE: The authentication endpoint now requires
a different request format. Update all clients to use the
new format documented in API.md.

Closes #789
```

### Documentation
```bash
docs(readme): update installation instructions

Add Windows-specific setup steps and troubleshooting guide.
Include common issues and their solutions.
```

### Refactoring
```bash
refactor(utils): simplify date formatting logic

Extract date formatting into separate utility functions.
No functional changes, just improved code organization.
```

### Multiple Issues
```bash
fix(ui): resolve multiple layout issues

- Fix header alignment on mobile
- Correct footer spacing
- Adjust sidebar width

Fixes #123, #124, #125
```

## Best Practices

1. **Use imperative mood**: "add feature" not "added feature"
2. **Keep subject under 50 characters**: Be concise
3. **Capitalize subject**: Start with capital letter
4. **No period at end**: Subject is a title, not a sentence
5. **Separate subject and body**: Use blank line
6. **Wrap body at 72 characters**: For readability
7. **Explain what and why**: Not how (code shows how)
8. **Reference issues**: Link to issue tracker

## Bad Examples

❌ `fixed bug` - Too vague, no type
❌ `feat: Added new feature for users to login with email` - Too long
❌ `update code` - No type, unclear what changed
❌ `WIP` - Not descriptive, should not be in main branch
❌ `asdfasdf` - Meaningless

## Good Examples

✅ `feat(auth): add email login`
✅ `fix(api): prevent duplicate user creation`
✅ `docs: update API documentation`
✅ `refactor(utils): extract date helpers`
✅ `test(auth): add login flow tests`
