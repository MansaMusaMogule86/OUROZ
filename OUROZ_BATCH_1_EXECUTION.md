# OUROZ Batch 1 Execution Pack

## Mission

Ship the **first production hardening batch** for OUROZ.

This batch is **not** about random polish.
This batch is about removing the biggest launch blockers first.
The roadmap says the most critical remaining issues are:

1. contact form backend
2. Stripe webhook verification
3. environment variable audit
4. missing backend files that can crash authenticated routes
5. route protection
6. Supabase RLS
7. first live data migrations for admin and business critical surfaces

These are explicitly called out as the highest-priority unfinished items in the roadmap. fileciteturn1file1L1-L31 fileciteturn1file4L1-L24

---

## What Batch 1 Must Deliver

### Scope lock

You must complete only these items in this batch:

#### A. Critical infrastructure

1. Wire the `/contact` page to a real backend flow
2. Add **real Stripe webhook signature verification** for production
3. Audit and normalize environment variable loading

#### B. Backend crash blockers

4. Create `server/db/connection.ts`
5. Create `server/middleware/validation.ts`
6. Create `server/config.ts`
7. Ensure authenticated server routes stop crashing

#### C. Auth and security baseline

8. Enforce route protection for admin, supplier, and business areas
9. Add first-pass Supabase RLS policies for all production-used tables
10. Review and tighten CORS config
11. Add input validation and sanitization for public forms and API entry points
12. Add rate limiting to public endpoints

#### D. First live-data migrations only

13. Replace mock data on **Admin suppliers** with real Supabase queries
14. Replace mock data on **Admin businesses** with real Supabase queries
15. Replace mock data on **Wholesale dashboard** with real Supabase queries
16. Replace mock data on **Business dashboard** with real Supabase queries

Do **not** work on Trade OS full live integration in this batch.
Do **not** work on broad visual redesign.
Do **not** touch low priority polish unless it is required to support the above.

---

## Success Criteria

Batch 1 is complete only if all of these are true:

1. `/contact` successfully submits and persists to a DB table or sends through a real email provider with error handling
2. Stripe webhook rejects invalid signatures and processes only verified events
3. Missing backend config files exist and are actually used
4. No authenticated backend route crashes because of missing imports or config
5. Admin, supplier, and business pages are no longer publicly accessible
6. RLS exists for all tables currently powering live production flows
7. The four selected mock-data pages now read from real Supabase data
8. Public API routes have rate limiting
9. CORS is production-safe
10. The codebase builds cleanly and passes lint and typecheck
11. A short `BATCH_1_REPORT.md` is generated at the end with completed work, open risks, env vars required, and next-step recommendations

---

## Repo Operating Rules

Follow these rules strictly:

1. Inspect the repo before changing anything
2. Reuse existing patterns before inventing new abstractions
3. Prefer minimal safe changes over giant rewrites
4. Keep UI styling consistent with the current luxury brand system
5. Do not break existing B2C storefront flows that are already live
6. Do not remove files unless clearly dead and unused
7. If a required dependency is missing, add it cleanly and explain why in the final report
8. If schema changes are needed, create proper migration files
9. If RLS policies are added, document assumptions about roles and ownership
10. Every changed area must include defensive error handling

---

## Required Execution Order

### Step 1
Map the repo first

Inspect and document:

1. app router structure
2. Supabase client usage patterns
3. existing Stripe route implementation
4. existing contact page form implementation
5. Express server folder structure
6. auth middleware and current role logic
7. which admin and dashboard pages are still mock-driven
8. which Supabase tables already exist and can support the first live migrations

Then create a short internal execution plan before modifying files.

### Step 2
Fix infrastructure blockers first

Do these in order:

1. `server/config.ts`
2. `server/db/connection.ts`
3. `server/middleware/validation.ts`
4. env loading cleanup
5. Stripe webhook verification
6. contact form backend

### Step 3
Lock down auth and security

Do these in order:

1. protected route enforcement
2. server-side auth checks where needed
3. RLS policies
4. CORS tightening
5. sanitization and validation
6. rate limiting

### Step 4
Migrate first live-data pages

Do only these pages in this batch:

1. admin suppliers
2. admin businesses
3. wholesale dashboard
4. business dashboard

For each page:

1. remove mock imports only if safe
2. replace with typed Supabase query layer
3. add loading state
4. add empty state
5. add error state
6. keep current UI design intact

### Step 5
Verify

Run and fix:

1. lint
2. typecheck
3. build
4. any existing test suite that already exists

Then generate `BATCH_1_REPORT.md`

---

## Technical Expectations

### Contact form backend

Preferred implementation:

1. Create a `contact_submissions` table in Supabase if one does not exist
2. Submit form data through a secure server action or API route
3. Validate fields with Zod
4. Sanitize message content
5. Add spam protection basics such as rate limiting and honeypot if reasonable
6. Return clear success and failure responses
7. Optionally trigger email notification if a provider is already configured

Minimum fields:

1. name
2. email
3. subject
4. message
5. created_at
6. status

### Stripe webhook verification

Must include:

1. raw body handling
2. signature verification using Stripe webhook secret
3. rejection of unsigned or invalid payloads
4. explicit event allowlist
5. safe idempotent handling for repeated events
6. logging for failed verification without exposing secrets

### Environment variable audit

Produce:

1. a central config module
2. a runtime validation schema
3. clear separation for client-safe and server-only vars
4. fail-fast behavior for missing critical server env vars in production
5. `.env.example` updates if needed

### Backend gap fixes

`server/db/connection.ts` should:

1. initialize DB connection cleanly
2. export typed helpers or client
3. avoid hidden singleton bugs

`server/middleware/validation.ts` should:

1. provide reusable Zod validation middleware
2. support body, params, and query validation as needed
3. return consistent error payloads

`server/config.ts` should:

1. parse env vars
2. expose typed config
3. centralize port, DB, auth, email, storage, Stripe settings

### Route protection

Must protect:

1. admin routes
2. supplier routes
3. business routes

Protection must be enforced in the actual Next.js routing layer or layout level, not left as comments.

### Supabase RLS

At minimum:

1. users can only access their own user-scoped data
2. suppliers can only manage their own supplier resources
3. business users can only access their own business records
4. admins can access admin-managed datasets appropriately
5. public read access exists only where explicitly intended

If role mapping is incomplete, document the exact assumption model used.

### Rate limiting

Apply to:

1. contact submission endpoint
2. auth sensitive public endpoints if custom routes exist
3. Stripe-sensitive or public mutation endpoints where appropriate

### Live data migration pages

Use:

1. typed queries
2. pagination if needed
3. filters only if already in UI
4. no fake metrics unless clearly labeled

---

## File Outputs To Create Or Update

Expected outputs may include:

1. `server/config.ts`
2. `server/db/connection.ts`
3. `server/middleware/validation.ts`
4. contact API route or server action
5. Supabase migration for `contact_submissions` and RLS changes
6. protected route or layout enforcement files
7. query helpers for admin suppliers and businesses
8. query helpers for wholesale and business dashboard
9. `.env.example`
10. `BATCH_1_REPORT.md`

---

## Hard Constraints

1. Do not refactor the whole app
2. Do not redesign the admin UI
3. Do not start Trade OS full backend build in this batch
4. Do not add fancy abstractions that slow shipping
5. Do not leave TODO comments instead of finishing critical work
6. Do not use mock data in any file touched for the four selected migrations
7. Do not expose secrets to the client
8. Do not bypass webhook verification just to make tests pass

---

## Definition Of Done Checklist

Mark all items explicitly in the final report:

### Infrastructure

1. Contact form backend completed
2. Stripe webhook verification completed
3. Env audit completed

### Backend

4. `server/config.ts` created and wired
5. `server/db/connection.ts` created and wired
6. `server/middleware/validation.ts` created and wired

### Security

7. Route protection enforced
8. RLS added
9. CORS tightened
10. Validation and sanitization added
11. Rate limiting added

### Live data

12. Admin suppliers live
13. Admin businesses live
14. Wholesale dashboard live
15. Business dashboard live

### Verification

16. Lint passes
17. Typecheck passes
18. Build passes
19. Batch report created

---

## Final Output Format

At the end, output these sections exactly:

1. `COMPLETED`
2. `FILES_CHANGED`
3. `MIGRATIONS_ADDED`
4. `ENV_VARS_REQUIRED`
5. `RISKS / FOLLOW UPS`
6. `HOW TO TEST`

Also write the same summary into `BATCH_1_REPORT.md` inside the repo.

---

# Claude Prompt Version

Copy this into Claude Code or Claude in repo mode:

```md
You are executing Batch 1 production hardening for the OUROZ codebase.

Your job is to ship only the highest-leverage first batch from the current roadmap.

The roadmap says the remaining highest-priority work includes critical infrastructure, backend gaps, auth and security hardening, and mock-to-live migration on selected admin and dashboard surfaces. Specifically, the roadmap lists contact form backend, Stripe webhook verification, environment variable audit, missing backend files, route protection, RLS, and mock-to-live migrations for admin/business surfaces as outstanding high-priority work.

## Your mission

Complete this exact batch:

### Critical infrastructure
1. Wire `/contact` to a real backend flow
2. Add production-grade Stripe webhook signature verification
3. Audit and normalize environment variable loading

### Backend crash blockers
4. Create `server/config.ts`
5. Create `server/db/connection.ts`
6. Create `server/middleware/validation.ts`
7. Fix authenticated route crashes caused by missing backend wiring

### Auth and security baseline
8. Enforce route protection for admin, supplier, and business areas
9. Add first-pass Supabase RLS policies for production-used tables
10. Tighten CORS
11. Add validation and sanitization on public inputs and API entry points
12. Add rate limiting to public endpoints

### First live-data migrations only
13. Migrate Admin suppliers from mock data to Supabase
14. Migrate Admin businesses from mock data to Supabase
15. Migrate Wholesale dashboard from mock data to Supabase
16. Migrate Business dashboard from mock data to Supabase

## Rules

1. Inspect the repo first and map the relevant architecture before editing
2. Reuse existing patterns where possible
3. Make minimal safe production-ready changes
4. Keep current luxury UI styling intact
5. Do not start full Trade OS live backend integration in this batch
6. Do not redesign unrelated pages
7. If DB changes are needed, create proper migrations
8. Add defensive error handling everywhere you touch
9. Use typed query layers where possible
10. No mock data is allowed to remain in the four migrated surfaces

## Required execution order

### Step 1
Inspect:
1. app routing structure
2. contact page implementation
3. Stripe route implementation
4. Supabase client patterns
5. Express server structure
6. auth middleware and role logic
7. current mock-driven admin and dashboard pages
8. existing DB schema and useful tables

Then create a short execution plan.

### Step 2
Fix infrastructure blockers in this order:
1. `server/config.ts`
2. `server/db/connection.ts`
3. `server/middleware/validation.ts`
4. env loading cleanup
5. Stripe webhook verification
6. contact form backend

### Step 3
Lock down security in this order:
1. protected route enforcement
2. server-side auth checks where needed
3. RLS policies
4. CORS tightening
5. validation and sanitization
6. rate limiting

### Step 4
Migrate only these pages to live data:
1. admin suppliers
2. admin businesses
3. wholesale dashboard
4. business dashboard

For each migrated page:
1. use real Supabase queries
2. keep existing UI design
3. add loading state
4. add empty state
5. add error state

### Step 5
Verify everything:
1. lint
2. typecheck
3. build
4. existing tests if any

Then generate `BATCH_1_REPORT.md`.

## Technical expectations

### Contact form
Use a secure API route or server action, validate with Zod, sanitize input, store in Supabase or send through configured email provider, and return real success and failure states.

### Stripe webhook
Must verify signatures with the webhook secret, use raw body, reject invalid signatures, allowlist handled event types, and handle retries idempotently.

### Env audit
Create central typed config, validate required env vars, separate server-only from client-safe vars, and update `.env.example` if necessary.

### Missing backend files
Create and wire:
1. `server/config.ts`
2. `server/db/connection.ts`
3. `server/middleware/validation.ts`

### Route protection
Protect admin, supplier, and business areas in the actual Next.js routing layer or layouts.

### RLS
Add sensible first-pass policies so users only access allowed records. Document assumptions.

### Rate limiting
Apply to contact and other public mutation endpoints.

## Deliverables
You must output these sections exactly at the end:
1. `COMPLETED`
2. `FILES_CHANGED`
3. `MIGRATIONS_ADDED`
4. `ENV_VARS_REQUIRED`
5. `RISKS / FOLLOW UPS`
6. `HOW TO TEST`

Also write the same summary into `BATCH_1_REPORT.md`.
```

---

# Antigravity Prompt Version

Copy this into Antigravity for a tighter execution pass:

```md
Ship Batch 1 production hardening for OUROZ.

## Only do this scope
1. Contact form backend
2. Stripe webhook verification
3. Env/config audit
4. Create missing backend files:
   - `server/config.ts`
   - `server/db/connection.ts`
   - `server/middleware/validation.ts`
5. Enforce route protection for admin, supplier, business
6. Add first-pass Supabase RLS
7. Add CORS tightening
8. Add input validation/sanitization
9. Add rate limiting
10. Replace mock data with real Supabase queries on:
   - Admin suppliers
   - Admin businesses
   - Wholesale dashboard
   - Business dashboard

## Do not do
1. Do not redesign UI
2. Do not start full Trade OS backend
3. Do not touch unrelated pages
4. Do not leave TODO comments instead of finishing work

## Workflow
1. Inspect repo and map architecture first
2. Make minimal safe production changes
3. Reuse existing query/client patterns
4. Add migrations if schema or RLS changes are needed
5. Add loading, empty, and error states for migrated pages
6. Run lint, typecheck, and build
7. Create `BATCH_1_REPORT.md`

## Final output must include
1. COMPLETED
2. FILES_CHANGED
3. MIGRATIONS_ADDED
4. ENV_VARS_REQUIRED
5. RISKS / FOLLOW UPS
6. HOW TO TEST
```

---

## What To Use For Claude vs Antigravity

### Use Claude for

1. backend wiring
2. Stripe webhook verification
3. config architecture
4. auth and route protection
5. RLS policy work
6. multi-file reasoning across server and app layers
7. migration planning

### Use Antigravity for

1. focused implementation passes
2. converting selected mock pages to live data without overthinking
3. wiring loading, empty, and error states
4. smaller production hardening sweeps after architecture is decided

### Best move

Run **Claude first** with this Batch 1 file.
Then run **Antigravity second** to clean up remaining selected page migrations and polish around those exact touched areas.

That gives you the highest chance of shipping fast **without** architecting yourself into a stupid corner.
