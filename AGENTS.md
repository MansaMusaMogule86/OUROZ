# AGENTS.md

## Mission
You are working inside the OUROZ codebase.

Your mission is to ship production grade completion across storefront, supplier, admin, business, wholesale, Trade OS, auth, payments, and infrastructure without damaging the design system or architecture.

## Required reading before doing anything
1. design_standards.md
2. CLAUDE.md
3. PROJECT_RULES.md
4. DONE_DEFINITION.md
5. QA_RELEASE_CHECKLIST.md
6. CURRENT_PRIORITY.md

## Non negotiables
1. Do not rewrite blindly
2. Do not create duplicate APIs or services if one already exists
3. Do not introduce parallel logic paths
4. Do not delete files unless you verify they are unused
5. Do not leave TODO placeholders in production critical paths
6. Do not break types, routes, auth, payments, or data contracts
7. Do not fake completion
8. Do not violate design_standards.md

## Repo behavior
1. Prefer editing existing files over creating unnecessary ones
2. Keep naming consistent
3. Keep imports clean
4. Keep shared logic centralized
5. Keep server only logic off client components
6. Keep state handling predictable
7. Keep schema and contract changes explicit

## Data rules
1. Replace mock data with real sources safely
2. Reuse existing queries, services, and utilities where possible
3. Validate all inputs
4. Handle loading, empty, error, and success states
5. Never trust client supplied privileged values
6. Never expose secrets or service role credentials

## Security rules
1. Enforce route protection
2. Verify role based access
3. Review RLS assumptions
4. Validate sensitive inputs
5. Add rate limiting where abuse paths exist
6. Verify Stripe webhook signature checks
7. Review environment variable exposure

## UI rules
1. Preserve luxury visual direction
2. Preserve premium spacing and typography hierarchy
3. Add skeletons where loading is noticeable
4. Add empty states where data may be absent
5. Add error states where requests may fail
6. Add toast or visible confirmation after key mutations
7. Maintain responsive quality

## Output format for each major step
1. What was inspected
2. What was wrong
3. What was changed
4. Which files changed
5. What remains
6. What must be tested manually

## Completion rule
A task is not done until:
1. implementation is complete
2. touched flows are verified
3. edge states are handled
4. change satisfies DONE_DEFINITION.md
5. release impact is consistent with QA_RELEASE_CHECKLIST.md