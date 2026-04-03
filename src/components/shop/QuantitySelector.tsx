'use client';

interface Props {
  value: number;
  onChange: (nextValue: number) => void;
  min?: number;
}

export default function QuantitySelector({ value, onChange, min = 1 }: Props) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-[var(--color-charcoal)]/10 bg-[var(--color-sahara)]/50">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-2 text-sm text-[var(--color-charcoal)]/55 transition-colors hover:bg-[var(--color-charcoal)]/5"
      >
        -
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-medium text-[var(--color-charcoal)]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="px-3 py-2 text-sm text-[var(--color-charcoal)]/55 transition-colors hover:bg-[var(--color-charcoal)]/5"
      >
        +
      </button>
    </div>
  );
}
