---
name: check
description: Run lint, type-check, and unit tests before committing. Reports a clear pass/fail summary with actionable fixes.
allowed-tools: Bash(npm run lint), Bash(npm run type-check), Bash(npm run test)
---

Run the following three checks in sequence inside `d:/CA Learning Portal/portal`. Do NOT stop on the first failure — run all three so the developer gets a complete picture.

## Step 1 — Lint
```
npm run lint
```

## Step 2 — Type-check
```
npm run type-check
```

## Step 3 — Unit tests
```
npm run test
```

---

After all three complete, produce a single summary table in this exact format:

| Check | Status | Issues |
|-------|--------|--------|
| ESLint | ✅ Clean / ❌ N errors, N warnings | list files with errors |
| TypeScript | ✅ Clean / ❌ N errors | list files with errors |
| Unit Tests | ✅ N passed / ❌ N failed | list failing test names |

Then:
- If **all three pass**: say "✅ Ready to commit." and stop.
- If **anything fails**: list each issue with the exact file path and line number, explain the root cause in one sentence, and suggest the minimal fix. Do not make any file changes — just report.
