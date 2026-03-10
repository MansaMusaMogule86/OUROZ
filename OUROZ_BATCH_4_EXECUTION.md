# OUROZ Batch 4 Execution

## Goal
Finish platform hardening, polish, testing, CI, and release readiness.

## Scope

### Backend gaps
1. create `server/db/connection.ts`
2. create `server/middleware/validation.ts`
3. create `server/config.ts`
4. wire real email provider
5. wire file upload storage
6. add API rate limiting

### Security
1. enforce route protection
2. define Supabase RLS policies
3. review CORS
4. verify input sanitization
5. verify webhook signature validation

### UX polish
1. React error boundaries
2. loading skeletons
3. toast notifications
4. video player modal
5. per page SEO metadata
6. image optimization
7. optional PWA manifest

### Testing and CI
1. unit tests
2. integration tests
3. E2E tests
4. GitHub Actions
5. staging rules

### Performance
1. bundle analysis
2. legacy cleanup
3. dynamic imports review
4. database indexing

## Execution sequence

### Phase 1
Fix missing backend files and config so authenticated server paths stop being fragile.

### Phase 2
Lock down auth and RLS.
No public admin, supplier, or business data leakage.

### Phase 3
Add UX resilience.
The app should never feel broken or blank.

### Phase 4
Add tests around highest risk flows.
1. auth
2. checkout
3. supplier actions
4. admin access
5. Trade OS critical actions

### Phase 5
Add CI gates.
Pull requests should fail on type, lint, test, or build errors.

### Phase 6
Performance cleanup.
Remove dead weight and improve slow queries.

## Mandatory QA targets
1. shop browse to checkout
2. auth login signup reset
3. supplier registration and dashboard
4. admin access restrictions
5. business dashboard and invoices
6. Trade OS create and detail flows
7. contact form submission
8. Stripe webhook verification path

## Definition of done
1. no critical TODO remains from priorities 4 to 8
2. minimum viable test suite exists
3. CI blocks broken merges
4. release checklist is green
5. production security baseline is acceptable
