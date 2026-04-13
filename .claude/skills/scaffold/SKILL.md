---
name: scaffold
description: Scaffold a new admin API feature. Usage: /scaffold <feature-name> e.g. /scaffold coupons or /scaffold courses/reviews
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(npm run type-check)
---

Scaffold a complete, production-ready admin API feature named **$ARGUMENTS** for the NS Academy CA Learning Portal at `d:/CA Learning Portal/portal`.

## Context
- Framework: Next.js 16 App Router
- Auth guard: `requireAdmin()` from `@/lib/admin-auth` — discriminated union `{ userId } | { error: Response }`
- ORM: Prisma 7 via `@/lib/prisma` (accessor: `prisma.<modelName>`)
- Validation: Zod v4 — import from `zod`
- Response shape: `{ success: true, data: ... }` or `{ success: false, error: "..." }`
- Prices always in paise (₹1 = 100 paise)
- All admin routes live at `app/api/admin/<feature>/route.ts` and `app/api/admin/<feature>/[id]/route.ts`

## What to create

### 1. Collection route — `app/api/admin/$ARGUMENTS/route.ts`
- `GET` — list all records (include relevant relations, orderBy createdAt desc)
- `POST` — create a record (Zod validation, 400 on invalid, 201 on success, 500 on DB error)

### 2. Item route — `app/api/admin/$ARGUMENTS/[id]/route.ts`
- `GET` — single record by id (404 if not found)
- `PATCH` — partial update (Zod partial schema, only update provided fields)
- `DELETE` — delete by id

### 3. Unit test — `__tests__/api/admin-$ARGUMENTS.test.ts`
Follow the exact pattern from existing tests:
- Hoist mocks with `vi.mock('@/lib/admin-auth', ...)` and `vi.mock('@/lib/prisma', ...)`
- `mockAdmin()` and `mockUnauthorized()` helpers
- `makeRequest()` helper
- Test every route: 401 unauthenticated, 400 validation, 2xx success, 500 DB error
- `beforeEach(() => vi.clearAllMocks())`

## Rules
- Read `app/api/admin/courses/route.ts` and `__tests__/api/admin-courses.test.ts` first to match the exact code style
- Read `prisma/schema.prisma` to understand the data model and check if a model for $ARGUMENTS already exists
- If the Prisma model does not exist, add it to `prisma/schema.prisma` with appropriate fields and enums
- Never use `any` — define proper TypeScript types
- Every response must go through the `requireAdmin()` guard
- After creating all files, run `npm run type-check` and fix any errors before finishing

## Output
List every file created/modified with a one-line description of what it does.
