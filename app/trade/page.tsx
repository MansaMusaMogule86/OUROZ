'use client';

import DashboardStats from '@/components/trade/dashboard/DashboardStats';
import DashboardAISummary from '@/components/trade/dashboard/DashboardAISummary';
import DashboardAlerts from '@/components/trade/dashboard/DashboardAlerts';
import DashboardActivityFeed from '@/components/trade/dashboard/DashboardActivityFeed';
import DashboardQuickActions from '@/components/trade/dashboard/DashboardQuickActions';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeDashboardStats } from '@/lib/trade/trade-service';
import type { TradeDashboardStats } from '@/types/trade';

export default function TradeDashboardPage() {
    const { data: stats, loading, error, refetch } = useTradeData<TradeDashboardStats | null>(
        () => fetchTradeDashboardStats(),
        null,
    );

    if (loading) return <TradeLoadingState message="Loading command center..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;
    if (!stats) return <TradeLoadingState />;

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div>
                <h1
                    className="text-2xl font-bold text-stone-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Command Center
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                    Morocco → Dubai trade intelligence at a glance
                </p>
            </div>

            {/* Stats Grid */}
            <DashboardStats stats={stats} />

            {/* Main content: AI + Activity | Alerts + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column — 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    <DashboardAISummary insights={stats.aiInsights} />
                    <DashboardActivityFeed activities={stats.recentActivity} />
                </div>

                {/* Right column — 1/3 */}
                <div className="space-y-6">
                    <DashboardAlerts alerts={stats.alerts} />
                    <DashboardQuickActions />
                </div>
            </div>
        </div>
    );
}
