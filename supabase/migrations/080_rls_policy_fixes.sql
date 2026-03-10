-- =============================================================================
-- RLS policy fixes
-- Adds admin write access to Trade OS read-only tables,
-- UPDATE to trade_shipments, and admin ALL to order_items.
-- =============================================================================

-- ─────────────────────────────────────────────
-- Trade OS: Admin write access on read-only tables
-- These tables are managed by admin / backend services.
-- ─────────────────────────────────────────────

create policy "trade_suppliers: admin all"
    on trade_suppliers for all
    using (auth.is_admin())
    with check (auth.is_admin());

create policy "trade_quotes: admin all"
    on trade_quotes for all
    using (auth.is_admin())
    with check (auth.is_admin());

create policy "trade_prices: admin all"
    on trade_prices for all
    using (auth.is_admin())
    with check (auth.is_admin());

create policy "trade_compliance: admin all"
    on trade_compliance for all
    using (auth.is_admin())
    with check (auth.is_admin());

create policy "trade_ai_insights: admin all"
    on trade_ai_insights for all
    using (auth.is_admin())
    with check (auth.is_admin());

create policy "trade_activity: admin all"
    on trade_activity for all
    using (auth.is_admin())
    with check (auth.is_admin());

create policy "trade_alerts: admin all"
    on trade_alerts for all
    using (auth.is_admin())
    with check (auth.is_admin());

-- ─────────────────────────────────────────────
-- Trade OS: Owner UPDATE on shipments
-- Users need to update tracking info, status, etc.
-- ─────────────────────────────────────────────

create policy "trade_shipments: owner update"
    on trade_shipments for update
    using (auth.uid() = owner_user_id);

create policy "trade_shipments: admin all"
    on trade_shipments for all
    using (auth.is_admin())
    with check (auth.is_admin());

-- ─────────────────────────────────────────────
-- order_items: Admin all (missing from migration 010)
-- Admins need to manage order items for support operations.
-- ─────────────────────────────────────────────

create policy "order_items: admin all"
    on order_items for all
    using (auth.is_admin());
