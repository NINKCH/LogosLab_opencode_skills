# Release Management

## Semantic Versioning

### Format
```
MAJOR.MINOR.PATCH

Example: 1.2.3
```

### Version Increments

```
1.0.0 → 1.0.1  (PATCH: bug fixes, no new features)
1.0.1 → 1.1.0  (MINOR: new features, backward compatible)
1.1.0 → 2.0.0  (MAJOR: breaking changes)
```

### Pre-release Versions

```
1.0.0-alpha.1   (Alpha release)
1.0.0-beta.1    (Beta release)
1.0.0-rc.1      (Release candidate)
1.0.0           (Stable release)
```

## Release Workflow

### 1. Prepare Release Branch
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.3.0
```

### 2. Update Version
```bash
# For Node.js projects
npm version 1.3.0

# For Python projects
# Update version in setup.py or __version__.py

# For other projects
# Update version in appropriate config file
```

### 3. Generate Changelog
```bash
# Using conventional-changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s

# Or manually update CHANGELOG.md
```

### 4. Commit Changes
```bash
git add .
git commit -m "chore: prepare release v1.3.0"
```

### 5. Merge to Main
```bash
git checkout main
git merge --no-ff release/v1.3.0
git tag -a v1.3.0 -m "Release v1.3.0"
git push origin main --tags
```

### 6. Merge Back to Develop
```bash
git checkout develop
git merge --no-ff release/v1.3.0
git push origin develop
```

### 7. Clean Up
```bash
git branch -d release/v1.3.0
git push origin --delete release/v1.3.0
```

## Changelog Format

### Example CHANGELOG.md
```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-01-18

### Added
- OAuth2 authentication with Google and GitHub
- User profile management
- Dark mode support

### Changed
- Improved API response times by 40%
- Updated UI design for better accessibility

### Fixed
- Race condition in user creation
- Memory leak in WebSocket connections

### Security
- Patched XSS vulnerability in comment system

## [1.2.0] - 2026-01-01

### Added
- Real-time notifications
- Export data to CSV

### Fixed
- Login redirect issue
```

## Release Checklist

### Pre-release
- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Version number updated
- [ ] Changelog generated
- [ ] Migration scripts ready (if needed)
- [ ] Rollback plan documented

### Release
- [ ] Create release branch
- [ ] Merge to main
- [ ] Tag release
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Monitor for issues

### Post-release
- [ ] Merge back to develop
- [ ] Delete release branch
- [ ] Announce release
- [ ] Update documentation site
- [ ] Close related issues

## Hotfix Release

### When to Use
- Critical bugs in production
- Security vulnerabilities
- Data corruption issues

### Workflow
```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/v1.2.1

# 2. Fix the issue
git add .
git commit -m "fix: critical security patch"

# 3. Update version (patch increment)
npm version patch

# 4. Merge to main
git checkout main
git merge --no-ff hotfix/v1.2.1
git tag -a v1.2.1 -m "Hotfix v1.2.1"
git push origin main --tags

# 5. Merge to develop
git checkout develop
git merge --no-ff hotfix/v1.2.1
git push origin develop

# 6. Clean up
git branch -d hotfix/v1.2.1
```

## Release Notes Template

```markdown
# Release v1.3.0

## 🎉 Highlights

- Major new feature: OAuth2 authentication
- Performance improvements: 40% faster API responses
- New dark mode for better user experience

## ✨ New Features

- OAuth2 authentication with Google and GitHub (#123)
- User profile management (#124)
- Dark mode support (#125)

## 🐛 Bug Fixes

- Fixed race condition in user creation (#456)
- Resolved memory leak in WebSocket connections (#457)

## 🔒 Security

- Patched XSS vulnerability in comment system (#789)

## 📚 Documentation

- Updated API documentation
- Added OAuth2 integration guide

## ⚠️ Breaking Changes

None

## 🙏 Contributors

Thanks to @user1, @user2, and @user3 for their contributions!

## 📦 Installation

```bash
npm install package@1.3.0
```

## 🔗 Links

- [Full Changelog](https://github.com/org/repo/compare/v1.2.0...v1.3.0)
- [Documentation](https://docs.example.com)
```
