---
name: ship
description: Full pre-deployment gate. Runs lint + type-check + unit tests + production build. Use before merging to main or deploying to production.
allowed-tools: Bash(npm run lint), Bash(npm run type-check), Bash(npm run test), Bash(npm run build)
---

Run the following four checks in sequence inside `d:/CA Learning Portal/portal`. Run all steps regardless of failures — the goal is a complete deployment readiness report.

## Step 1 — Lint
```
npm run lint
```

## Step 2 — TypeScript
```
npm run type-check
```

## Step 3 — Unit tests
```
npm run test
```

## Step 4 — Production build
```
npm run build
```

---

After all four complete, produce a **Deployment Readiness Report** in this format:

---
## 🚀 Deployment Readiness Report

| Gate | Status | Details |
|------|--------|---------|
| ESLint | ✅ / ❌ | |
| TypeScript | ✅ / ❌ | |
| Unit Tests | ✅ N passed / ❌ N failed | |
| Production Build | ✅ / ❌ | bundle size if available |

**Overall: ✅ READY TO DEPLOY / ❌ NOT READY — N issues must be fixed first**

---

### Issues to fix before deploying (if any)
List each issue with: file path + line + root cause (1 sentence) + minimal fix suggestion.

### What to do next
- If all green: "Run `npm run test:e2e` then merge to main."
- If any red: List the specific commands or file changes needed, in priority order.
