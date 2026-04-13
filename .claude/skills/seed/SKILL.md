---
name: seed
description: Seed or reset the test database. Usage: /seed (test data) or /seed prod (production seed)
argument-hint: [test|prod]
allowed-tools: Bash(npm run db:seed:test), Bash(npm run db:seed), Bash(npm run db:push)
---

Seed the NS Academy database inside `d:/CA Learning Portal/portal`.

The argument is: **$ARGUMENTS**

## Decision logic

- If argument is empty or `test` → run `npm run db:seed:test`
  - Creates: admin user, 1 test student, 2 courses, 3 sections, 8 lessons, enrollments, payments, FAQs, testimonials, site content
  - Safe to re-run — the seed is fully idempotent

- If argument is `prod` → run `npm run db:seed`
  - Seeds production baseline data only (no test users or dummy payments)
  - Confirm with the user before running this since it targets the production DB

- If argument is `reset` → run `npm run db:push` first (resets schema), then `npm run db:seed:test`
  - ⚠️ WARNING: This drops and recreates all tables. Ask the user to confirm before proceeding.

## After seeding

Report a summary in this format:

---
## ✅ Seed Complete

| Resource | Count |
|----------|-------|
| Admin users | 1 |
| Student users | 4 |
| Courses | 2 |
| Sections | 3 |
| Lessons | 8 |
| Enrollments | 1 |
| Payments | 2 |
| FAQs | 4 |
| Testimonials | 3 |
| Site content items | 15 |

**Test credentials:**
- Admin: `admin@nsacademy.dev` / `AdminPass@1234` → http://localhost:3000/admin/login
- Student: `testplayer@nsacademy.dev` / `TestPass@1234` → http://localhost:3000/login
