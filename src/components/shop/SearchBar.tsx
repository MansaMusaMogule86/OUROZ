'use client';

import { useState, type KeyboardEvent } from 'react';

interface Props {
  onSearch: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search products...',
  autoFocus = false,
  className = '',
}: Props) {
  const [value, setValue] = useState('');

  function submit() {
    onSearch(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className={`flex items-center gap-2 rounded-2xl border border-[var(--color-charcoal)]/10 bg-white/60 px-4 py-3 ${className}`}>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-transparent text-sm font-body text-[var(--color-charcoal)] outline-none placeholder:text-[var(--color-charcoal)]/30"
      />
      <button
        type="button"
        onClick={submit}
        className="rounded-full bg-[var(--color-charcoal)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-sahara)] transition-opacity hover:opacity-85"
      >
        Search
      </button>
    </div>
  );
}
