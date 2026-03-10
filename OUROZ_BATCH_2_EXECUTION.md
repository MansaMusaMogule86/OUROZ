# OUROZ Batch 2 Execution

## Goal
Ship all remaining mock data to live data migrations, then complete the minimum backend support those screens need.

## Scope

### Admin live data migration
1. Admin suppliers page
2. Admin businesses page
3. Admin subscriptions page
4. Admin invoices page
5. Admin credit page
6. Admin risk page

### Business and wholesale live data migration
1. Wholesale dashboard
2. Business dashboard
3. Business invoices
4. Business subscription

### Shared requirements
1. Replace hardcoded arrays and fake metrics with typed Supabase queries
2. Preserve existing luxury UI and interaction patterns
3. Add loading, empty, error, and retry states
4. Add pagination, sorting, and filtering where the UI already implies scale
5. Ensure all queries respect role boundaries
6. Add server side guards for admin and business access

## Hard rules
1. Do not redesign the UI
2. Do not rename routes unless absolutely required
3. Do not break the current storefront, supplier, or auth flows
4. Prefer creating shared data hooks instead of duplicating fetch logic
5. Use strict TypeScript types everywhere
6. Remove mock data imports once live queries are wired

## Required deliverables
1. A list of all files migrated from mock to live
2. New or updated Supabase queries and service functions
3. Any SQL needed for missing views or indexes
4. A short migration report with:
   1. what changed
   2. what assumptions were made
   3. what still needs real backend support
   4. what should be tested manually

## Execution plan

### Phase 1
Audit each admin and business page.
Find:
1. mock data files
2. local constants
3. fake metrics
4. fake charts
5. missing empty states
6. any missing table fields in Supabase

### Phase 2
Create or update shared data access layer.
Examples:
1. `src/lib/admin/*`
2. `src/lib/business/*`
3. `src/hooks/useAdmin*`
4. `src/hooks/useBusiness*`

### Phase 3
Wire live data into the pages.
For each page:
1. replace mock arrays
2. connect filters to real query params
3. format dates, money, and statuses consistently
4. add skeleton loaders
5. add empty states
6. add toast or inline error messages

### Phase 4
Harden access.
1. admin pages require admin role
2. business pages require business role
3. supplier pages stay scoped to supplier role
4. do not trust client only gating

### Phase 5
Performance pass.
1. avoid N plus 1 queries
2. use selective fields
3. add indexes for filters and ordering columns
4. memoize expensive transforms

## Definition of done
1. No remaining mock data on pages listed in scope
2. Type check passes
3. Lint passes
4. Build passes
5. Each migrated screen has loading, empty, and error states
6. Access control exists at route and data layer
7. Final report is included

## Output format
Return:
1. summary
2. changed files
3. SQL migrations if needed
4. manual QA checklist
5. risks
