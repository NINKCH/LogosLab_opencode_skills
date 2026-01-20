# Code Review Checklist

## Pre-Review
- [ ] PR has clear title and description
- [ ] Linked to relevant issue/ticket
- [ ] CI/CD checks are passing
- [ ] No merge conflicts
- [ ] Appropriate reviewers assigned

## Code Quality
- [ ] Code follows project style guide
- [ ] Naming is clear and consistent
- [ ] Functions are small and focused
- [ ] No code duplication (DRY principle)
- [ ] Comments explain "why", not "what"
- [ ] No commented-out code
- [ ] No console.log or debug statements

## Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Input validation is present
- [ ] No hardcoded values (use constants/config)

## Security
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] Sensitive data is not logged
- [ ] Authentication/authorization is correct
- [ ] Input is sanitized
- [ ] Dependencies are up to date

## Performance
- [ ] No N+1 query problems
- [ ] Appropriate use of caching
- [ ] No unnecessary database calls
- [ ] Efficient algorithms used
- [ ] No memory leaks
- [ ] Lazy loading where appropriate

## Testing
- [ ] Unit tests are present
- [ ] Tests cover happy path
- [ ] Tests cover edge cases
- [ ] Tests cover error scenarios
- [ ] Test names are descriptive
- [ ] Tests are independent
- [ ] Test coverage meets threshold

## Documentation
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Inline comments for complex logic
- [ ] CHANGELOG updated
- [ ] Migration guide if breaking changes

## Architecture
- [ ] Follows SOLID principles
- [ ] Appropriate design patterns used
- [ ] Separation of concerns
- [ ] Proper abstraction levels
- [ ] No circular dependencies

## Database
- [ ] Migrations are reversible
- [ ] Indexes are appropriate
- [ ] No breaking schema changes
- [ ] Data integrity maintained

## Frontend (if applicable)
- [ ] Responsive design
- [ ] Accessibility (WCAG compliance)
- [ ] Browser compatibility
- [ ] No prop drilling
- [ ] Proper state management
- [ ] No unnecessary re-renders

## API (if applicable)
- [ ] RESTful conventions followed
- [ ] Proper HTTP status codes
- [ ] Versioning strategy
- [ ] Rate limiting considered
- [ ] Pagination for lists
- [ ] Proper error responses

## Final Checks
- [ ] No breaking changes (or properly documented)
- [ ] Backward compatibility maintained
- [ ] Performance impact assessed
- [ ] Security implications reviewed
- [ ] Ready for production

## Reviewer Notes
[Add any specific concerns or observations here]

## Approval
- [ ] Approved
- [ ] Approved with minor changes
- [ ] Request changes
