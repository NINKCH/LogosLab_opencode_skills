# Branch Protection Rules

## Recommended Settings

### Main Branch (Production)
```yaml
main:
  - Require pull request reviews (2 approvals)
  - Require status checks to pass
  - Require branches to be up to date
  - Require conversation resolution
  - Restrict who can push
  - Do not allow force pushes
  - Do not allow deletions
```

**Why**: Main branch represents production code and needs maximum protection

### Develop Branch (Integration)
```yaml
develop:
  - Require pull request reviews (1 approval)
  - Require status checks to pass
  - Allow force pushes (for maintainers only)
```

**Why**: Develop needs protection but more flexibility for integration work

### Feature Branches
```yaml
feature/*:
  - No restrictions (developers have full control)
```

**Why**: Feature branches are temporary and developers need flexibility

## GitHub Settings Example

Navigate to: Repository → Settings → Branches → Add rule

**Branch name pattern**: `main`

Enable:
- ✅ Require a pull request before merging
  - ✅ Require approvals: 2
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Select required checks: CI, Tests, Lint
- ✅ Require conversation resolution before merging
- ✅ Require signed commits
- ✅ Require linear history
- ✅ Include administrators
- ✅ Restrict who can push to matching branches
- ✅ Do not allow bypassing the above settings

## GitLab Settings Example

Navigate to: Repository → Settings → Repository → Protected branches

**Branch**: `main`

Settings:
- Allowed to merge: Maintainers
- Allowed to push: No one
- Allowed to force push: No
- Code owner approval: Required

## Best Practices

1. **Start strict**: Easier to relax rules than tighten them
2. **Document exceptions**: When and why rules can be bypassed
3. **Review regularly**: Adjust rules as team grows
4. **Automate checks**: Use CI/CD for consistent enforcement
5. **Train team**: Ensure everyone understands the rules
