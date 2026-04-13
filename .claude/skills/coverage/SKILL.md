---
name: coverage
description: Run unit tests with coverage report. Shows which files are under-tested and suggests which tests to write next.
allowed-tools: Bash(npm run test:coverage)
---

Run test coverage for the NS Academy portal at `d:/CA Learning Portal/portal`:

```
npm run test:coverage
```

After it completes, analyse the output and produce this report:

---
## 📊 Test Coverage Report

### Summary
| Metric | Coverage | Threshold | Status |
|--------|----------|-----------|--------|
| Lines | X% | 70% | ✅ / ❌ |
| Functions | X% | 70% | ✅ / ❌ |
| Branches | X% | 60% | ✅ / ❌ |
| Statements | X% | 70% | ✅ / ❌ |

### Files below threshold
List any file under the configured threshold with its current coverage %.

### Top 3 files most worth testing next
For each file below 60% coverage, explain in one sentence what behaviour is currently untested and suggest a specific test case to add.

### Files with excellent coverage (≥ 90%)
List them briefly as a positive note.

---

If all thresholds pass: "✅ Coverage thresholds met. HTML report at `coverage/index.html`."
If any threshold fails: "❌ Coverage below threshold. Write tests for the files listed above before merging."
