# Git Commands Reference

## Creating Branches

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Create branch from specific commit
git checkout -b hotfix/bug-fix abc123

# Create branch from remote
git checkout -b feature/remote-feature origin/feature/remote-feature
```

## Managing Branches

```bash
# List all branches
git branch -a

# List remote branches
git branch -r

# Delete local branch
git branch -d feature/completed-feature

# Force delete unmerged branch
git branch -D feature/abandoned-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Rename current branch
git branch -m new-branch-name

# Rename specific branch
git branch -m old-name new-name
```

## Merging Strategies

```bash
# Standard merge (creates merge commit)
git checkout main
git merge feature/new-feature

# Squash merge (combines all commits into one)
git merge --squash feature/new-feature
git commit -m "feat: add new feature"

# Rebase (linear history)
git checkout feature/new-feature
git rebase main

# Interactive rebase (clean up commits)
git rebase -i HEAD~5
```

## Conflict Resolution

```bash
# Check conflict status
git status

# View conflicts
git diff

# Accept theirs
git checkout --theirs path/to/file

# Accept ours
git checkout --ours path/to/file

# Abort merge
git merge --abort

# Abort rebase
git rebase --abort

# Continue after resolving
git add .
git rebase --continue
# or
git merge --continue
```

## Stashing Changes

```bash
# Stash current changes
git stash

# Stash with message
git stash save "WIP: working on feature"

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply specific stash
git stash apply stash@{2}

# Pop stash (apply and remove)
git stash pop

# Drop stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

## Tagging Releases

```bash
# Create annotated tag
git tag -a v1.2.0 -m "Release version 1.2.0"

# Push tags
git push origin --tags

# List tags
git tag -l

# Delete tag
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0
```

## Changelog Generation

```bash
# Using conventional-changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s

# Using git log
git log --oneline --decorate --graph v1.1.0..v1.2.0
```
