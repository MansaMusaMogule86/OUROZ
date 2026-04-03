/**
 * ShopTabs — pill-style tab switcher used inside ShopClientShell.
 */
'use client';

export interface Tab {
  value: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
}

export default function ShopTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(42,32,22,0.05)' }}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-lg text-[10px] font-body font-semibold uppercase tracking-[0.15em] transition-all ${
            active === tab.value
              ? 'bg-white text-[var(--color-charcoal)] shadow-sm'
              : 'text-[var(--color-charcoal)]/40 hover:text-[var(--color-charcoal)]/65'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
