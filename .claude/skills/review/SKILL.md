---
name: review
description: Review staged or recent changes before committing. Checks code quality, security, test coverage, and conventions.
allowed-tools: Bash(git diff --staged), Bash(git diff HEAD~1), Bash(git status), Bash(git log --oneline -5), Read, Grep
---

Review the current changes in the NS Academy portal at `d:/CA Learning Portal/portal` before committing.

## Step 1 — Get the diff
```
git diff --staged
```
If nothing is staged, fall back to:
```
git diff HEAD~1
```

## Step 2 — Analyse every changed file

For each changed file, check the following:

### ✅ Code Quality
- No `console.log` left in production code (allowed in seed/test files)
- No hardcoded secrets, API keys, or credentials
- No commented-out code blocks left behind
- TypeScript types are explicit — no unnecessary `any`
- Functions are focused — no function doing more than one thing

### ✅ Security (critical for this project)
- All admin API routes call `requireAdmin()` as the first step
- No user-controlled data passed to Prisma without Zod validation first
- Payments: amounts come from the database (server-authoritative), never from the request body
- No SQL injection risk (Prisma parameterises queries, but flag any raw queries)
- No sensitive data returned in API responses (passwords, full tokens, service role keys)

### ✅ Test Coverage
- If a new API route was added: is there a corresponding test in `__tests__/api/`?
- If a new component was added: is there a test in `__tests__/components/`?
- If a bug was fixed: is there a new test that would have caught it?

### ✅ Conventions (this codebase)
- Server Components fetch data directly via Prisma — no fetch() to own API on the server
- Client Components are marked `"use client"` and handle interactivity only
- Admin routes use `requireAdmin()` discriminated union pattern correctly
- Prices stored and handled in paise, displayed in rupees
- ISR: public pages have `export const revalidate = 60`
- `revalidatePath()` called after mutations to content/FAQs/testimonials

## Step 3 — Produce a review report

---
## 🔍 Code Review

### Changed files
List each file with a one-line description of what changed.

### Issues found
Group by severity:

**🔴 Must fix before commit** (security issues, broken logic, missing auth guard)

**🟡 Should fix** (missing tests, leftover debug code, convention violations)

**🟢 Nice to have** (style suggestions, minor improvements)

### Verdict
- If no red issues: "✅ Looks good. Safe to commit."
- If red issues: "❌ Fix the issues marked 🔴 before committing."
