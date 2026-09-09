import React, { useState, useRef, KeyboardEvent } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className = '',
  ariaLabel = 'Navigation Tabs',
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = items.findIndex((item) => item.id === activeId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % items.length;
      while (items[nextIndex]?.disabled && nextIndex !== currentIndex) {
        nextIndex = (nextIndex + 1) % items.length;
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + items.length) % items.length;
      while (items[nextIndex]?.disabled && nextIndex !== currentIndex) {
        nextIndex = (nextIndex - 1 + items.length) % items.length;
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    if (nextIndex !== currentIndex && !items[nextIndex]?.disabled) {
      const nextTab = items[nextIndex];
      onChange(nextTab.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 overflow-x-auto ${className}`}
    >
      {items.map((item, index) => {
        const isSelected = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={isSelected}
            aria-controls={`tabpanel-${item.id}`}
            tabIndex={isSelected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => !item.disabled && onChange(item.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 select-none min-h-[40px] focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:outline-none ${
              isSelected
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            } ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
