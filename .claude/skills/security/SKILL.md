---
name: security
description: Run a full security audit of the codebase. Checks for secrets, auth bypasses, data exposure, input validation gaps, insecure headers, and payment integrity issues.
allowed-tools: Read, Grep, Glob, Bash(git diff --staged), Bash(git log --oneline -5)
---

Run a full security audit of the NS Academy CA Learning Portal at `d:/CA Learning Portal/portal`.

## What to check

### 1. Secrets & environment
- Scan ALL source files for hardcoded secrets, API keys, tokens, passwords (patterns: `sk_`, `rzp_`, `service_role`, `password`, `secret`, `token`)
- Confirm no `NEXT_PUBLIC_` prefix on secret keys (Razorpay secret, Supabase service role, DB password must NEVER be NEXT_PUBLIC_)
- Verify `.gitignore` excludes `.env*`, `.env.local`
- Verify `.env.example` contains only placeholders, no real values

### 2. Admin API routes — every file in `app/api/admin/`
For every route handler (GET, POST, PATCH, DELETE) check:
- Is `requireAdmin()` called as the VERY FIRST thing? (before any DB query, before reading body)
- Is the return value checked: `if (auth.error) return auth.error`
- No route skips auth even for "read-only" GETs

### 3. Student API routes — files in `app/api/` (non-admin)
- Every route that accesses user data must call `supabase.auth.getUser()` and check for null user
- Progress GET: must verify enrollment before returning lesson IDs
- Notes POST: must verify enrollment before creating notes
- Certificate download: must verify `certificate.userId === user.id`

### 4. Payment integrity
- `app/api/payments/create-order/route.ts`: price must come from `prisma.course.findUnique()` — NEVER from request body
- `app/api/payments/verify/route.ts`: HMAC signature must be verified with `crypto.timingSafeEqual` before any DB write

### 5. Input validation
- Every route that accepts a request body must use a Zod schema via `.safeParse()`
- No raw `req.json()` passed directly to Prisma
- `videoUrl` fields validated as proper URLs
- String fields have max-length limits to prevent oversized payload attacks

### 6. Data exposure
- No API response returns `razorpaySignature` (HMAC secret)
- No API response returns `SUPABASE_SERVICE_ROLE_KEY` or database passwords
- Admin student detail: payments response uses `select` not `include` to exclude signature

### 7. File uploads (`app/api/admin/upload/route.ts`)
- MIME type validated against allowlist (not just file extension)
- File size limited (max 100 MB)
- `bucket` and `folder` parameters validated against allowlists (no path traversal)
- Extension derived from validated MIME type, NOT from user-supplied filename

### 8. Security headers (`next.config.ts`)
- `X-Frame-Options: DENY` present
- `X-Content-Type-Options: nosniff` present
- `Referrer-Policy` present
- `Permissions-Policy` present
- `Strict-Transport-Security` present
- CSP does NOT contain `unsafe-eval`
- CSP has `object-src 'none'` and `base-uri 'self'`

### 9. Proxy/Middleware (`proxy.ts` — Next.js 16 convention)
- `/admin/*` routes redirect to `/admin/login` if no session
- `/dashboard` and `/checkout` routes redirect to `/login` if no session
- Admin role check: `user.user_metadata?.role === 'ADMIN'`

### 10. Frontend — no secrets on the client side
- Grep all `components/` and `app/` client files for any import of `lib/supabase/admin.ts` (admin client must NEVER be used in client components)
- No `process.env.SUPABASE_SERVICE_ROLE_KEY` or `RAZORPAY_KEY_SECRET` referenced in any client component

---

## Output format

Produce a security report:

---
## 🔒 Security Audit Report

### Critical (fix before any commit)
### High (fix before production)
### Medium (fix this sprint)
### Low / Informational
### ✅ Passed checks

For each issue: **File path + line number | What the problem is | Exact fix**

### Overall verdict
**SECURE ✅** — safe to commit, or  
**VULNERABILITIES FOUND ❌** — do not commit until fixed
