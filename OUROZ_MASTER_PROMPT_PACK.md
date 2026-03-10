# OUROZ Master Prompt Pack

Generated from the current OUROZ roadmap and TODOs. Source roadmap: `/mnt/data/TODO.md`.

---

## 1. Best Use Case Split

Use **Claude** for:

1. Large refactors
2. Multi file backend work
3. Route protection and auth flows
4. Supabase schema and RLS policy generation
5. API integration swaps from mock data to live data
6. Writing tests across multiple modules
7. Producing migration plans and implementation diffs

Use **Antigravity** for:

1. Fast UI polish
2. Component level fixes
3. Page by page implementation
4. Tailwind cleanup
5. Loading skeletons
6. Error boundaries
7. SEO metadata work
8. Small, focused feature drops

Best combo:

1. Claude plans and implements architecture-heavy tasks
2. Antigravity ships the UI layer and page specific fixes
3. Claude validates integration boundaries after UI work lands

---

## 2. What Must Be Done First

Based on the roadmap, the fastest high impact execution order is:

### Phase 1

1. Contact form backend
2. Stripe webhook signature verification
3. Environment variable audit
4. Missing backend files
   1. `server/db/connection.ts`
   2. `server/middleware/validation.ts`
   3. `server/config.ts`
5. Route protection for admin, supplier, and business areas
6. Supabase RLS policies
7. Rate limiting and CORS hardening

### Phase 2

1. Replace admin mock data with live Supabase queries
2. Replace wholesale and business mock dashboards with live data
3. Add toast system, skeletons, and error boundaries

### Phase 3

1. Build Trade OS API routes
2. Create Trade OS Supabase tables
3. Replace `mock-*.ts` with live queries
4. Connect AI features to Gemini or Claude

### Phase 4

1. Add tests
2. Add CI/CD
3. Add staging deployment
4. Run bundle analysis and indexing

---

## 3. Master Prompt for Claude

Copy this whole prompt into Claude when you want the strongest end to end implementation push.

```md
You are the lead staff engineer for OUROZ.

Your job is to finish the remaining production work for the app with zero fluff and maximum execution quality.

## Product Context
OUROZ is a Morocco focused commerce platform with:
1. B2C storefront already live
2. Supplier portal already live
3. Admin, wholesale, business, and Trade OS areas partially complete
3. Many pages are UI complete but still use mock data
4. Build is currently passing

## Current State
Completed areas:
1. Storefront, auth, supplier portal, blog, about, FAQ
2. Admin shell and many management pages
3. Trade OS UI is complete but all mock data
4. Supabase types and base migrations exist
5. Stripe routes exist

Remaining work to finish:
1. Contact form backend
2. Stripe webhook signature verification
3. Environment variable audit
4. Backend missing files:
   1. server/db/connection.ts
   2. server/middleware/validation.ts
   3. server/config.ts
5. Route protection is not enforced
6. Supabase RLS policies are missing
7. Admin, wholesale, and business pages still use mock data
8. Trade OS still needs real API routes, tables, and live queries
9. Email provider is not configured
10. File upload is not integrated
11. Rate limiting, CORS hardening, sanitization, and security review are incomplete
12. Error boundaries, skeletons, toasts, and video modal are incomplete
13. Test coverage is zero
14. CI/CD and staging are missing
15. Performance pass is still needed

## Source TODO Summary
Priority 1 Critical Infrastructure:
1. Contact form backend
2. Stripe webhook verification
3. Environment variable audit

Priority 2 Mock to Live Migration:
1. Admin suppliers page
2. Admin businesses page
3. Admin subscriptions page
4. Admin invoices page
5. Admin credit page
6. Admin risk page
7. Wholesale dashboard
8. Business dashboard
9. Business invoices
10. Business subscription

Priority 3 Trade OS Live API:
1. Trade OS API routes
2. Trade OS database tables
3. Replace all 7 mock data files with live queries
4. Connect AI features to Gemini or Claude

Priority 4 Backend Gaps:
1. Missing db connection file
2. Missing validation middleware
3. Missing config file
4. Email service not configured
5. File upload endpoint incomplete
6. No rate limiting

Priority 5 Auth and Security:
1. Route protection
2. RLS
3. CORS lockdown
4. Input sanitization
5. API rate limiting

Priority 6 UX and Polish:
1. Error boundaries
2. Skeleton loaders
3. Toast notifications
4. Video player modal
5. SEO metadata
6. Image optimization
7. Offline support review

Priority 7 Testing and CI/CD:
1. Unit tests
2. Integration tests
3. E2E tests
4. GitHub Actions pipeline
5. Staging deployment

Priority 8 Performance:
1. Bundle analysis
2. Legacy page cleanup
3. Code splitting review
4. Database indexing

## Important Constraints
1. Keep existing premium luxury UI intact
2. Do not redesign unless needed for functional completion
3. Prefer incremental production safe changes
4. Keep types strict
5. Use reusable utilities and avoid duplicated logic
6. Assume Next.js frontend, Supabase backend, Stripe payments, Tailwind styling
7. Any mock data replacement must use real typed Supabase queries or API handlers
8. Protect all privileged routes and data access

## What I want from you
Execute in batches.

### Step 1
Audit the project structure and identify exactly where each missing feature should live.

### Step 2
Produce an implementation plan grouped into these batches:
1. Security and infrastructure
2. Mock to live migration
3. Trade OS backend and AI integration
4. UX polish
5. Testing and deployment
6. Performance cleanup

### Step 3
For Batch 1 only, generate production ready code changes for:
1. Contact form backend wired to Supabase or email provider
2. Stripe webhook signature verification
3. server/db/connection.ts
4. server/middleware/validation.ts
5. server/config.ts
6. Route protection enforcement
7. Rate limiting
8. CORS hardening
9. Input sanitization helpers
10. Initial RLS policies for relevant tables

### Step 4
After Batch 1, continue to Batch 2 and Batch 3 only if the codebase structure supports it cleanly.

## Output Format
Return the following in order:
1. Audit findings
2. Exact files to create or update
3. Code diffs or full file contents
4. Migration SQL if needed
5. Env variables required
6. Test checklist
7. Rollback notes

## Quality Bar
1. No placeholder code
2. No fake integrations
3. No unexplained abstractions
4. Keep changes shippable
5. Explain assumptions clearly when codebase gaps block certainty
6. Prefer code that can be pasted directly into the repo

Start with Batch 1 now.
```

---

## 4. Focused Prompt for Antigravity

Use this when you want a more surgical builder that will move page by page without overthinking.

```md
You are implementing the remaining production tasks for the OUROZ app.

Your mission is to finish the app without changing the brand feel.
The UI must remain premium, luxury, and consistent with the current design language.

## Current app state
1. Storefront, auth, and supplier portal are already live
2. Admin, business, wholesale, and Trade OS areas are partly mock based
3. Trade OS UI is complete but not connected to live backend data
4. Several backend and security tasks are still missing

## Highest priority tasks
1. Contact form backend
2. Stripe webhook verification
3. Missing backend infra files
4. Route protection
5. Replace admin mock pages with live Supabase data
6. Replace wholesale and business mock pages with live data
7. Add error boundaries, skeletons, and toasts
8. Add SEO metadata and image optimization

## Rules
1. Keep design untouched unless required for function
2. Preserve all existing component patterns
3. Prefer direct implementation over discussion
4. Use typed Supabase queries
5. Do not leave TODO comments where production code is required
6. Ship one batch at a time with exact file changes

## Execution order
### Batch A
1. Fix infrastructure blockers
2. Add route guards
3. Wire contact form backend
4. Secure Stripe webhook

### Batch B
1. Replace admin mock data pages with live queries
2. Replace business and wholesale mock pages with live queries

### Batch C
1. Add error boundaries
2. Add loading skeletons
3. Add toast notifications
4. Implement video player modal
5. Add metadata improvements

## Output format
1. Files to edit
2. Full file contents or exact patches
3. Required env vars
4. Manual verification steps
5. Any schema changes needed

Start with Batch A only.
```

---

## 5. One Shot Automation Prompt

This is the cleanest single prompt if you want either model to act like a repo finisher.

```md
Finish the remaining production work for OUROZ.

Context:
OUROZ already has a working storefront, auth, supplier portal, and completed Trade OS UI. What remains is production hardening, backend completion, replacing mock data with live data, and shipping security, testing, and deployment polish.

Tasks remaining:
1. Contact form backend
2. Stripe webhook verification
3. Environment variable audit
4. Missing backend files for db connection, validation middleware, and config
5. Email service provider configuration
6. File upload integration
7. Rate limiting
8. Route protection
9. Supabase RLS
10. Admin mock pages to live data
11. Wholesale and business mock dashboards to live data
12. Trade OS API routes
13. Trade OS database tables
14. Replace all Trade OS mock data files
15. AI integration for Trade OS
16. Error boundaries
17. Skeleton loaders
18. Toast notifications
19. Video player modal
20. SEO metadata
21. Image optimization
22. Unit, integration, and E2E tests
23. GitHub Actions CI/CD
24. Staging deployment
25. Bundle analysis, legacy cleanup, code splitting review, and DB indexing

Requirements:
1. Keep the luxury UI intact
2. Use strict typing
3. Prefer incremental and production safe changes
4. Output implementation in execution batches
5. For each batch provide exact files to create or update
6. Provide copy paste ready code
7. Include SQL migrations, env vars, and verification steps where needed
8. Do not stop at planning only. Implement the first batch in code

Start with the highest leverage batch first.
```

---

## 6. Suggested File Pack To Drive Execution

Create these files in your repo root and feed them to Claude or Antigravity one by one.

### `docs/OUROZ_EXECUTION_PLAN.md`

```md
# OUROZ Execution Plan

## Batch 1 Security and Infrastructure
1. Contact form backend
2. Stripe webhook verification
3. Missing backend config files
4. Route protection
5. Rate limiting
6. CORS hardening
7. Input sanitization
8. Initial RLS

## Batch 2 Mock to Live Migration
1. Admin suppliers
2. Admin businesses
3. Admin subscriptions
4. Admin invoices
5. Admin credit
6. Admin risk
7. Wholesale dashboard
8. Business dashboard
9. Business invoices
10. Business subscription

## Batch 3 Trade OS Live Integration
1. API routes
2. Supabase tables
3. Remove mock data files
4. AI integration

## Batch 4 UX Polish
1. Error boundaries
2. Skeleton loaders
3. Toasts
4. Video modal
5. SEO metadata
6. Image optimization

## Batch 5 Reliability and Delivery
1. Unit tests
2. Integration tests
3. E2E tests
4. CI/CD
5. Staging
6. Performance cleanup
```

### `docs/OUROZ_AGENT_RULES.md`

```md
# OUROZ Agent Rules

1. Do not redesign the app
2. Preserve luxury look and feel
3. Prefer typed utilities over inline hacks
4. Use Supabase for live data
5. Secure privileged routes and data first
6. Replace mock data only after backend path exists
7. Do not leave unfinished TODOs in shipped code
8. Output full file contents when a patch would be ambiguous
9. Include verification steps for every batch
10. Keep code production ready
```

### `docs/OUROZ_DEFINITION_OF_DONE.md`

```md
# OUROZ Definition of Done

A task is done only when:
1. Code compiles
2. Types pass
3. No mock data remains in targeted pages
4. Security requirements are enforced
5. Env vars are documented
6. Tests exist where meaningful
7. Manual verification steps are listed
8. No placeholder comments remain
```

---

## 7. What Skills or Modes to Use

### For Claude

Best modes or workflows:

1. **Planner mode** for repo audit and dependency mapping
2. **Code mode** for backend implementation batches
3. **Long context mode** for reading the whole repo and coordinating large refactors
4. **Artifact mode** if available for generating multiple files like SQL, env docs, and migration notes together

Best Claude task split:

1. Repo audit
2. Security batch
3. Supabase live migration batch
4. Trade OS backend batch
5. Test and CI batch

### For Antigravity

Best usage style:

1. Give it one batch at a time
2. Keep each task scoped to a directory or feature
3. Use it heavily for UI and app flow completion
4. Let it patch exact files instead of asking for broad architecture

Best Antigravity task split:

1. Contact page backend wiring if frontend heavy
2. Admin live data page conversions
3. Wholesale and business dashboards
4. Error boundaries, toasts, skeletons, metadata
5. Final polish pass

### Best Hybrid Setup

1. Claude handles infra, security, schema, API, RLS, tests
2. Antigravity handles page migrations, UI polish, interaction fixes
3. Claude does a final integration review and cleanup diff

---

## 8. Real Talk Recommendation

Do **not** ask one model to finish everything in one giant shot unless the repo is tiny.
The smart move is:

1. Feed the **Master Prompt for Claude** first
2. Get Batch 1 done
3. Feed **focused Antigravity prompts** for admin and dashboard live data swaps
4. Go back to Claude for Trade OS backend and RLS
5. Use Antigravity for polish
6. End with Claude for tests and CI

That split gives you way better output quality than one mega prompt that tries to do the whole war in one go.

---

## 9. Source Basis

This pack was generated from the OUROZ roadmap and TODO inventory in the uploaded roadmap file.
