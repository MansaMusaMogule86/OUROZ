'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { TRADE_NAV_SECTIONS } from '@/lib/trade/trade-constants';

interface TradeCommandPaletteProps {
    open: boolean;
    onClose: () => void;
}

interface CommandItem {
    id: string;
    label: string;
    section: string;
    icon: string;
    href: string;
}

function getAllCommands(): CommandItem[] {
    const commands: CommandItem[] = [];
    for (const section of TRADE_NAV_SECTIONS) {
        for (const item of section.items) {
            commands.push({
                id: item.href,
                label: item.label,
                section: section.title,
                icon: item.icon,
                href: item.href,
            });
        }
    }
    return commands;
}

export default function TradeCommandPalette({ open, onClose }: TradeCommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const allCommands = getAllCommands();

    const filtered = query
        ? allCommands.filter(
              (c) =>
                  c.label.toLowerCase().includes(query.toLowerCase()) ||
                  c.section.toLowerCase().includes(query.toLowerCase()),
          )
        : allCommands;

    useEffect(() => {
        if (open) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                router.push(filtered[selectedIndex].href);
                onClose();
            }
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose, filtered, selectedIndex, router]);

    // Global Cmd+K listener
    useEffect(() => {
        function handleGlobalKey(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (open) onClose();
            }
        }
        document.addEventListener('keydown', handleGlobalKey);
        return () => document.removeEventListener('keydown', handleGlobalKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
                    <span className="text-stone-400 text-sm">◈</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        placeholder="Search modules..."
                        className="flex-1 text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <kbd className="text-[9px] font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-400">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-64 overflow-y-auto py-2">
                    {filtered.length === 0 && (
                        <div className="px-5 py-6 text-center text-sm text-stone-400">No results found</div>
                    )}
                    {filtered.map((cmd, i) => (
                        <button
                            key={cmd.id}
                            onClick={() => { router.push(cmd.href); onClose(); }}
                            className={clsx(
                                'w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors',
                                i === selectedIndex ? 'bg-stone-50' : 'hover:bg-stone-50/50',
                            )}
                        >
                            <span className="text-sm text-stone-400 w-5 text-center">{cmd.icon}</span>
                            <span className="text-sm text-stone-700 font-medium">{cmd.label}</span>
                            <span className="ml-auto text-[9px] uppercase tracking-wider text-stone-400">
                                {cmd.section}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
