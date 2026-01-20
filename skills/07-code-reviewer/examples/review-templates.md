# Code Review Templates

## Security Issue Template

```markdown
🔴 **CRITICAL - Security Vulnerability**

**Issue**: [Brief description]

**Location**: `file.ts:line`

**Risk**: [Explain the security risk]

**Recommendation**:
\`\`\`typescript
// Instead of this:
[vulnerable code]

// Do this:
[secure code]
\`\`\`

**References**:
- [OWASP link or security best practice]
```

**Example**:
```markdown
🔴 **CRITICAL - Security Vulnerability**

**Issue**: SQL Injection vulnerability in user query

**Location**: `src/api/users.ts:45`

**Risk**: Attacker can execute arbitrary SQL commands, potentially accessing or deleting sensitive data.

**Recommendation**:
\`\`\`typescript
// Instead of this:
const query = `SELECT * FROM users WHERE id = ${userId}`

// Do this:
const query = 'SELECT * FROM users WHERE id = ?'
const result = await db.query(query, [userId])
\`\`\`

**References**:
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
```

---

## Performance Issue Template

```markdown
🟡 **MAJOR - Performance Concern**

**Issue**: [Brief description]

**Location**: `file.ts:line`

**Impact**: [Explain performance impact]

**Suggestion**:
\`\`\`typescript
// Current O(n²) approach:
[current code]

// Optimized O(n) approach:
[optimized code]
\`\`\`

**Benchmark**: [If applicable, show performance comparison]
```

**Example**:
```markdown
🟡 **MAJOR - Performance Concern**

**Issue**: N+1 query problem in user posts loading

**Location**: `src/services/posts.ts:23`

**Impact**: For 100 users, this generates 101 database queries instead of 2, causing significant slowdown.

**Suggestion**:
\`\`\`typescript
// Current O(n) queries:
for (const user of users) {
  user.posts = await db.posts.findMany({ where: { userId: user.id } })
}

// Optimized to 2 queries:
const userIds = users.map(u => u.id)
const posts = await db.posts.findMany({ where: { userId: { in: userIds } } })
const postsByUser = groupBy(posts, 'userId')
users.forEach(user => {
  user.posts = postsByUser[user.id] || []
})
\`\`\`

**Benchmark**: 
- Before: 2.5s for 100 users
- After: 0.15s for 100 users (16x faster)
```

---

## Code Quality Template

```markdown
🔵 **MINOR - Code Quality**

**Issue**: [Brief description]

**Location**: `file.ts:line`

**Suggestion**:
\`\`\`typescript
// Current:
[current code]

// Suggested:
[improved code]
\`\`\`

**Rationale**: [Explain why this is better]
```

**Example**:
```markdown
🔵 **MINOR - Code Quality**

**Issue**: Magic numbers without explanation

**Location**: `src/utils/pagination.ts:12`

**Suggestion**:
\`\`\`typescript
// Current:
const pageSize = 20
const maxPages = 100

// Suggested:
const DEFAULT_PAGE_SIZE = 20 // Items per page
const MAX_PAGES = 100 // Prevent excessive pagination
\`\`\`

**Rationale**: Named constants with comments make the code more maintainable and self-documenting.
```

---

## Architecture Issue Template

```markdown
🟠 **MAJOR - Architecture Concern**

**Issue**: [Brief description]

**Location**: [File or module]

**Problem**: [Explain the architectural issue]

**Suggestion**:
[Describe the recommended approach]

**Benefits**:
- [Benefit 1]
- [Benefit 2]
```

**Example**:
```markdown
🟠 **MAJOR - Architecture Concern**

**Issue**: Business logic in controller layer

**Location**: `src/controllers/orderController.ts`

**Problem**: The controller contains complex business logic for order processing, making it difficult to test and reuse.

**Suggestion**:
Extract business logic into a service layer:
- Create `src/services/orderService.ts`
- Move order validation, calculation, and processing logic
- Controller should only handle HTTP concerns (request/response)

**Benefits**:
- Easier to unit test business logic
- Logic can be reused in other contexts (CLI, background jobs)
- Better separation of concerns
```

---

## Test Coverage Template

```markdown
🟡 **MAJOR - Missing Tests**

**Issue**: [Brief description]

**Location**: `file.ts`

**Missing Coverage**:
- [ ] [Test case 1]
- [ ] [Test case 2]
- [ ] [Test case 3]

**Suggestion**:
\`\`\`typescript
[Example test code]
\`\`\`
```

**Example**:
```markdown
🟡 **MAJOR - Missing Tests**

**Issue**: Critical authentication logic lacks tests

**Location**: `src/auth/authService.ts`

**Missing Coverage**:
- [ ] Test successful login with valid credentials
- [ ] Test failed login with invalid credentials
- [ ] Test account lockout after multiple failed attempts
- [ ] Test token expiration handling
- [ ] Test password reset flow

**Suggestion**:
\`\`\`typescript
describe('AuthService', () => {
  it('should lock account after 5 failed login attempts', async () => {
    const authService = new AuthService()
    const email = 'test@example.com'
    
    // Attempt 5 failed logins
    for (let i = 0; i < 5; i++) {
      await authService.login(email, 'wrong-password')
    }
    
    // 6th attempt should be blocked
    await expect(authService.login(email, 'correct-password'))
      .rejects.toThrow('Account locked')
  })
})
\`\`\`
```
