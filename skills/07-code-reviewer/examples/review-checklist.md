# Code Review Checklist

Use this checklist to ensure comprehensive code reviews.

---

## Critical Issues (Must Fix)

These issues must be fixed before merging:

- [ ] **Security vulnerabilities**
  - SQL injection, XSS, CSRF
  - Exposed secrets or credentials
  - Missing authentication/authorization
  - Insecure data handling

- [ ] **Data loss risks**
  - Missing database transactions
  - Improper error handling in data operations
  - Race conditions in concurrent operations

- [ ] **Memory leaks**
  - Unclosed connections
  - Event listeners not removed
  - Circular references

- [ ] **Race conditions**
  - Concurrent access to shared resources
  - Missing locks or synchronization

- [ ] **Breaking changes without migration**
  - API changes without versioning
  - Database schema changes without migration scripts
  - Removed features without deprecation notice

---

## Major Issues (Should Fix)

These issues should be addressed before merging:

- [ ] **Performance problems**
  - N+1 query problems
  - Missing database indexes
  - Inefficient algorithms (O(n²) when O(n) is possible)
  - Large bundle sizes

- [ ] **Poor error handling**
  - Missing try-catch blocks
  - Generic error messages
  - Errors not logged
  - No error recovery strategy

- [ ] **Missing tests for critical paths**
  - Authentication/authorization logic
  - Payment processing
  - Data validation
  - Error scenarios

- [ ] **Violation of architectural principles**
  - Business logic in controllers
  - Tight coupling between modules
  - Violation of SOLID principles

- [ ] **Code duplication**
  - Copy-pasted code blocks
  - Similar logic in multiple places
  - Missing abstraction

---

## Minor Issues (Nice to Fix)

These issues improve code quality but are not blockers:

- [ ] **Naming improvements**
  - Unclear variable names
  - Inconsistent naming conventions
  - Abbreviations without context

- [ ] **Code style inconsistencies**
  - Mixed indentation
  - Inconsistent quote usage
  - Missing or extra whitespace

- [ ] **Missing documentation**
  - No JSDoc/docstrings for public APIs
  - Complex logic without comments
  - Missing README updates

- [ ] **Unused imports/variables**
  - Dead code
  - Commented-out code
  - Unused dependencies

- [ ] **Console.log statements**
  - Debug logs left in code
  - Should use proper logging library

---

## Additional Checks

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error messages are user-friendly
- [ ] Feature works as described in requirements

### Testing
- [ ] Unit tests cover new code
- [ ] Integration tests for API changes
- [ ] E2E tests for critical user flows
- [ ] Tests are meaningful and not just for coverage

### Documentation
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Inline comments for complex logic
- [ ] Migration guide for breaking changes

### Accessibility
- [ ] Proper ARIA labels
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader compatible

### Performance
- [ ] No unnecessary re-renders (React)
- [ ] Lazy loading where appropriate
- [ ] Images optimized
- [ ] Bundle size impact acceptable

### Security
- [ ] Input validation on all user inputs
- [ ] Output encoding to prevent XSS
- [ ] Authentication checks in place
- [ ] Sensitive data not logged

---

## Review Metrics

Track these for continuous improvement:

- **Time spent**: [X] minutes
- **Files reviewed**: [X] files
- **Issues found**:
  - Critical: [X]
  - Major: [X]
  - Minor: [X]
- **Test coverage**: [X]%
- **Code complexity**: [Acceptable/Needs improvement]
