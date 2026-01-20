# Workflow Examples

## Feature Development Workflow

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/PROJ-123-user-profile

# 2. Work on feature
git add .
git commit -m "feat: add user profile page"
git commit -m "feat: add profile edit functionality"
git commit -m "test: add profile tests"

# 3. Keep branch updated
git fetch origin
git rebase origin/develop

# 4. Push to remote
git push origin feature/PROJ-123-user-profile

# 5. Create pull request (via GitHub/GitLab UI)

# 6. After approval, merge to develop
git checkout develop
git pull origin develop
git merge --no-ff feature/PROJ-123-user-profile
git push origin develop

# 7. Delete feature branch
git branch -d feature/PROJ-123-user-profile
git push origin --delete feature/PROJ-123-user-profile
```

## Hotfix Workflow

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/PROJ-789-critical-fix

# 2. Fix the issue
git add .
git commit -m "fix: resolve critical security issue"

# 3. Merge to main
git checkout main
git merge --no-ff hotfix/PROJ-789-critical-fix
git tag -a v1.2.1 -m "Hotfix release v1.2.1"
git push origin main --tags

# 4. Merge to develop
git checkout develop
git merge --no-ff hotfix/PROJ-789-critical-fix
git push origin develop

# 5. Delete hotfix branch
git branch -d hotfix/PROJ-789-critical-fix
git push origin --delete hotfix/PROJ-789-critical-fix
```

## Release Workflow

```bash
# 1. Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.3.0

# 2. Update version numbers
npm version 1.3.0
git add package.json package-lock.json
git commit -m "chore: bump version to 1.3.0"

# 3. Generate changelog
npm run changelog
git add CHANGELOG.md
git commit -m "docs: update changelog for v1.3.0"

# 4. Merge to main
git checkout main
git merge --no-ff release/v1.3.0
git tag -a v1.3.0 -m "Release v1.3.0"
git push origin main --tags

# 5. Merge back to develop
git checkout develop
git merge --no-ff release/v1.3.0
git push origin develop

# 6. Delete release branch
git branch -d release/v1.3.0
git push origin --delete release/v1.3.0
```
