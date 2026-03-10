# OUROZ Batch 3 Execution

## Goal
Turn Morocco Trade OS from polished mock system into a working live product.

## Scope

### Trade OS backend foundation
1. Create Next.js API routes for RFQs, suppliers, prices, logistics, compliance, and deals
2. Design Supabase tables for trade workflows
3. Define typed request and response contracts
4. Create service layer for all Trade OS modules

### Trade OS live replacement
1. Replace all `mock-*.ts` data sources
2. Keep current UI structure, cards, drawers, timelines, charts, and tables
3. Support real query states and role aware data

### AI integration
1. Connect insights
2. Connect scoring
3. Connect negotiation strategy
4. Connect summaries and recommendations
5. Use provider abstraction so Gemini or Claude can be swapped

## Hard rules
1. Do not throw away the current Trade OS UI work
2. Build around the existing domain model unless clearly broken
3. Keep modules decoupled enough to scale later
4. All AI outputs must be optional and failure tolerant
5. Never block core workflows on AI response success

## Execution sequence

### Phase 1: data model
Create tables or confirm reuse for:
1. rfqs
2. rfq_items
3. rfq_quotes
4. trade_suppliers
5. supplier_capabilities
6. price_snapshots
7. price_alerts
8. shipments
9. shipment_events
10. compliance_documents
11. compliance_audits
12. deal_rooms
13. negotiation_messages
14. negotiation_terms
15. ai_runs or ai_logs

### Phase 2: API layer
Build API routes with validation, auth, and role checks.
For each domain:
1. list
2. detail
3. create
4. update
5. status transitions where needed

### Phase 3: live UI swap
For each module:
1. remove mock imports
2. connect list screens
3. connect detail screens
4. connect create flows
5. connect charts and metrics
6. add real empty and error states

### Phase 4: AI provider abstraction
Create a clean service contract such as:
1. `generateTradeInsight`
2. `scoreSupplier`
3. `draftNegotiationStrategy`
4. `summarizeShipmentRisk`
5. `reviewComplianceGap`

### Phase 5: resilience
1. timeouts
2. retries where sane
3. structured logs
4. provider fallback support if practical
5. safe parsing for model output

## Deliverables
1. SQL for Trade OS tables and indexes
2. API routes and services
3. AI service abstraction
4. live swapped UI files
5. short architecture note
6. follow up list for v2 improvements

## Definition of done
1. Trade OS screens use real data, not mocks
2. Core actions persist to DB
3. AI features call a real provider through one abstraction layer
4. Type check, lint, and build pass
5. Access is role protected
6. Basic audit trail exists for sensitive workflows
