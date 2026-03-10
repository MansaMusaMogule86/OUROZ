# OUROZ Full Project Finisher Prompt

Use this prompt in Claude for the final whole project pass.

---

You are the principal engineer and delivery owner for OUROZ.
Your job is to finish the project end to end, not partially, not cosmetically, and not with fake completions.

## Mission
Take OUROZ from current mixed state to production ready.
The app already has a strong live storefront, auth, supplier portal, content pages, partial admin live data, and a fully built but mock powered Trade OS. The remaining work is concentrated in infrastructure, mock to live migrations, backend completion, security, Trade OS backend, AI integration, UX resilience, testing, CI, and performance.

## Current truth
Treat the following as the source of truth for unfinished work:
1. Contact form backend missing
2. Stripe webhook signature verification not production safe
3. Environment variable audit needed
4. Admin suppliers, businesses, subscriptions, invoices, credit, and risk pages still on mock data
5. Wholesale dashboard and business dashboards and billing pages still on mock data
6. Trade OS backend routes and tables missing
7. Trade OS still depends on `mock-*.ts` sources
8. AI features not connected to real provider
9. Express backend missing `db/connection.ts`, `middleware/validation.ts`, and `config.ts`
10. Email provider not configured
11. File upload storage not integrated
12. Rate limiting missing
13. Route protection not fully enforced
14. Supabase RLS policies not fully defined
15. CORS and input sanitization need review
16. Error boundaries, skeletons, toasts, video modal, per page metadata, and image optimization still incomplete
17. Zero meaningful automated test coverage
18. CI and staging controls incomplete
19. Bundle and database performance work still pending

## Non negotiables
1. Keep the existing luxury visual identity intact
2. Do not do random rewrites
3. Do not leave mocks in place for any scoped screen when a real query can replace them
4. Do not mark work complete unless code actually exists
5. Preserve route structure unless a change is clearly necessary
6. Use strict TypeScript types
7. Use Zod validation for inputs where appropriate
8. Enforce auth both in UI and server side paths
9. Prefer maintainable architecture over hacks

## Master plan

### Part 1: Stabilize infrastructure and security first
Implement:
1. contact form backend
2. Stripe webhook signature verification
3. env config audit
4. missing backend files
5. route protection
6. RLS policies
7. CORS tightening
8. input sanitization
9. rate limiting

### Part 2: Remove remaining mock data from platform pages
Ship live data for:
1. admin suppliers
2. admin businesses
3. admin subscriptions
4. admin invoices
5. admin credit
6. admin risk
7. wholesale dashboard
8. business dashboard
9. business invoices
10. business subscription

### Part 3: Turn Trade OS into a real product
Implement:
1. DB tables
2. API routes
3. service layer
4. live data swap
5. AI provider integration with abstraction layer

### Part 4: Polish reliability and product quality
Implement:
1. error boundaries
2. loading skeletons
3. toast system
4. video player modal
5. per page SEO metadata
6. image optimization
7. optional PWA manifest if low risk

### Part 5: Add test and release guardrails
Implement:
1. unit tests
2. integration tests
3. E2E tests for critical flows
4. GitHub Actions pipeline
5. staging checks
6. bundle and query optimization

## Working style
1. Audit before editing
2. Group work into coherent batches
3. Create missing files where they are referenced but absent
4. Remove dead mock imports after replacement
5. Add comments only where useful
6. Return a serious engineering report, not fluff

## Required output format
Return exactly these sections:
1. Executive summary
2. Architecture decisions
3. Files changed
4. New files created
5. SQL migrations
6. Security changes
7. Mock to live migrations completed
8. Trade OS live integration completed
9. AI integration completed
10. Tests added
11. CI and deployment changes
12. Manual QA checklist
13. Remaining risks
14. Next best improvements

## Delivery rule
Work until the scoped project is actually finished.
Do not stop at analysis.
Do not stop at recommendations.
Do the implementation.
