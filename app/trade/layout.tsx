'use client';

import { useState, useCallback } from 'react';
import TradeSidebar from '@/components/trade/shell/TradeSidebar';
import TradeTopBar from '@/components/trade/shell/TradeTopBar';
import TradeCommandPalette from '@/components/trade/shell/TradeCommandPalette';

export default function TradeLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
    const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);
    const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);

    return (
        <div className="min-h-screen bg-[#FAF6F1]">
            <TradeSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <TradeTopBar
                sidebarCollapsed={sidebarCollapsed}
                onCommandPalette={openCommandPalette}
            />
            <main
                className="transition-all duration-300 p-6"
                style={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
            >
                {children}
            </main>
            <TradeCommandPalette open={commandPaletteOpen} onClose={closeCommandPalette} />
        </div>
    );
}
