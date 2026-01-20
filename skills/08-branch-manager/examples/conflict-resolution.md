# Conflict Resolution Guide

## Understanding Conflicts

When Git encounters conflicting changes, it marks them in the file:

```
<<<<<<< HEAD (current branch)
const API_URL = 'https://api.production.com'
=======
const API_URL = 'https://api.staging.com'
>>>>>>> feature/new-api (incoming branch)
```

## Resolution Strategies

### 1. Accept Current (Ours)
Keep the changes from your current branch:
```bash
git checkout --ours path/to/file
```

### 2. Accept Incoming (Theirs)
Accept the changes from the incoming branch:
```bash
git checkout --theirs path/to/file
```

### 3. Manual Resolution
Combine both changes intelligently:
```javascript
// Before (conflict):
<<<<<<< HEAD
const API_URL = 'https://api.production.com'
=======
const API_URL = 'https://api.staging.com'
>>>>>>> feature/new-api

// After (resolved):
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.production.com'
  : 'https://api.staging.com'
```

### 4. Use Merge Tool
Launch a visual merge tool:
```bash
git mergetool
```

## Common Conflict Scenarios

### Scenario 1: Same Line Modified
**Problem**: Both branches modified the same line differently
**Solution**: Manually review and combine changes or choose one

### Scenario 2: File Deleted vs Modified
**Problem**: One branch deleted a file, another modified it
**Solution**: Decide if file should exist with modifications or be deleted

### Scenario 3: Rename Conflicts
**Problem**: File renamed differently in both branches
**Solution**: Choose one name and update all references

## Prevention Tips

1. **Pull frequently**: Keep your branch up to date
2. **Small commits**: Easier to resolve conflicts
3. **Communicate**: Coordinate with team on overlapping work
4. **Feature flags**: Avoid conflicts in shared files
5. **Rebase regularly**: Integrate changes incrementally
