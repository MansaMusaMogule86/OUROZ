# PROJECT_RULES.md

## Architecture rules
1. Reuse existing patterns before creating new ones
2. Centralize shared logic
3. Avoid duplicate API layers
4. Keep server only code off client surfaces
5. Keep components focused and composable
6. Keep domain logic out of presentational components when possible

## Code quality rules
1. No dead code growth
2. No fake mocks in production paths
3. No silent failure for important flows
4. No unexplained any types unless absolutely unavoidable
5. No magic strings for repeated domain values
6. No hidden coupling between unrelated modules

## Data and state rules
1. Every async flow must handle loading
2. Every data view must handle empty state
3. Every failure path must surface useful feedback
4. Every important mutation should have visible success feedback
5. Input validation must exist for user supplied data

## Security rules
1. Protected pages must require correct auth
2. Privileged actions must require correct role
3. Sensitive operations must be server enforced
4. Secrets must never be exposed in client bundles
5. Webhooks must be verified
6. Abuse paths should be rate limited

## Delivery rules
1. Small safe steps beat giant rewrites
2. Explain changed files clearly
3. Do not mark complete work without verification
4. State remaining risks honestly
5. Preserve design_standards.md in all UI work