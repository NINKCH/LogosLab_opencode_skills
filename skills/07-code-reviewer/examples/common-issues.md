# Common Code Issues

Quick reference for frequently encountered issues during code reviews.

---

## Security Issues

### SQL Injection
```typescript
// ❌ Bad: Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ Good: Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?'
const result = await db.query(query, [userId])
```

### XSS (Cross-Site Scripting)
```typescript
// ❌ Bad: Directly inserting user input
element.innerHTML = userInput

// ✅ Good: Use textContent or sanitize
element.textContent = userInput
// or
element.innerHTML = DOMPurify.sanitize(userInput)
```

### Exposed Secrets
```typescript
// ❌ Bad: Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef'

// ✅ Good: Use environment variables
const API_KEY = process.env.API_KEY
```

### Missing Authentication
```typescript
// ❌ Bad: No auth check
app.get('/api/admin/users', async (req, res) => {
  const users = await db.users.findAll()
  res.json(users)
})

// ✅ Good: Require authentication
app.get('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
  const users = await db.users.findAll()
  res.json(users)
})
```

---

## Performance Issues

### N+1 Query Problem
```typescript
// ❌ Bad: N+1 queries
for (const user of users) {
  user.posts = await db.posts.findMany({ where: { userId: user.id } })
}

// ✅ Good: Batch loading
const userIds = users.map(u => u.id)
const posts = await db.posts.findMany({ where: { userId: { in: userIds } } })
const postsByUser = groupBy(posts, 'userId')
users.forEach(user => { user.posts = postsByUser[user.id] || [] })
```

### Inefficient Algorithm
```typescript
// ❌ Bad: O(n²) complexity
function hasDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true
    }
  }
  return false
}

// ✅ Good: O(n) complexity
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length
}
```

### Missing Memoization
```typescript
// ❌ Bad: Recalculates on every render
function Component({ items }) {
  const expensiveResult = expensiveCalculation(items)
  return <div>{expensiveResult}</div>
}

// ✅ Good: Memoize expensive calculations
function Component({ items }) {
  const expensiveResult = useMemo(() => expensiveCalculation(items), [items])
  return <div>{expensiveResult}</div>
}
```

---

## Code Quality Issues

### Missing Error Handling
```typescript
// ❌ Bad: No error handling
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ✅ Good: Proper error handling
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    logger.error('Failed to fetch user', { id, error })
    throw new FetchError('User fetch failed', { cause: error })
  }
}
```

### Magic Numbers
```typescript
// ❌ Bad: Unclear magic numbers
if (user.age > 18 && user.score > 100) {
  grantAccess()
}

// ✅ Good: Named constants
const MINIMUM_AGE = 18
const MINIMUM_SCORE = 100

if (user.age > MINIMUM_AGE && user.score > MINIMUM_SCORE) {
  grantAccess()
}
```

### Poor Naming
```typescript
// ❌ Bad: Unclear names
function calc(a, b) {
  return a * b * 0.2
}

// ✅ Good: Descriptive names
function calculateTaxAmount(price, quantity) {
  const TAX_RATE = 0.2
  return price * quantity * TAX_RATE
}
```

### Code Duplication
```typescript
// ❌ Bad: Duplicated logic
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateUserEmail(user) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
}

// ✅ Good: Reuse validation logic
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email) {
  return EMAIL_REGEX.test(email)
}

function validateUserEmail(user) {
  return isValidEmail(user.email)
}
```

---

## React-Specific Issues

### Missing Keys in Lists
```typescript
// ❌ Bad: No key prop
{items.map(item => <Item data={item} />)}

// ✅ Good: Proper key usage
{items.map(item => <Item key={item.id} data={item} />)}
```

### Inline Functions in Render
```typescript
// ❌ Bad: Creates new function on every render
<Button onClick={() => handleClick(id)} />

// ✅ Good: Memoized callback
const handleButtonClick = useCallback(() => handleClick(id), [id])
<Button onClick={handleButtonClick} />
```

### Missing Dependencies
```typescript
// ❌ Bad: Missing userId dependency
useEffect(() => {
  fetchData(userId)
}, [])

// ✅ Good: Complete dependencies
useEffect(() => {
  fetchData(userId)
}, [userId])
```

---

## TypeScript Issues

### Using `any` Type
```typescript
// ❌ Bad: Loses type safety
function processData(data: any) {
  return data.value
}

// ✅ Good: Proper typing
interface Data {
  value: string
}

function processData(data: Data) {
  return data.value
}
```

### Type Assertions Without Validation
```typescript
// ❌ Bad: Unsafe type assertion
const user = response.data as User

// ✅ Good: Validate before asserting
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj
}

const data = response.data
if (isUser(data)) {
  const user = data
}
```
