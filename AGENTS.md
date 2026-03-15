# Agent Guidelines

## Important Rules

- **Never remove node_modules** - always run `npm install` to fix corrupted/incomplete installs instead
- **Always verify package.json versions** before suggesting version changes
- **Check for security vulnerabilities** (CVEs) before finalizing dependencies
- **Fix code rather than downgrading versions** when build issues arise (unless security vulnerability requires it)
- **Wait for npm install to complete** before testing builds

## Workflow

- Run `npm install` and wait for completion before testing builds
- Verify all checks pass (lint, typecheck, build) before considering task complete
- When encountering build errors, research and fix the root cause rather than changing versions

## Dependencies

- Use latest stable versions of frameworks (Next.js stable, React stable, etc.)
- Always check for known CVEs in dependency versions
- Include all required dependencies in package.json before deployment
- **Use TanStack Query for all external API requests** - This provides caching, retry logic, loading states, and error handling out of the box

## Dependency Management

### When Build Fails
1. **First, fix the code** - Investigate the actual error and fix the root cause
2. **Check for breaking changes** - Review recent commits that added new dependencies
3. **Only as last resort** - Consider version changes if:
   - Security vulnerability requires it (and you can cite the CVE)
   - The error is proven to be caused by your newly added dependency
   - You've exhausted all code-level fixes

### Never
- Change versions to "see if it fixes" the build
- Downgrade core dependencies (Next.js, React) without strong evidence
- Assume version X "has issues" without verifying the actual cause
