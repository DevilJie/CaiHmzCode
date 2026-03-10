'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

export type LayoutMode = 'grid' | 'list';

interface LayoutToggleProps {
  value: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export default function LayoutToggle({ value, onChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary-100 dark:bg-dark-700 rounded-lg p-1">
      <button
        onClick={() => onChange('grid')}
        className={clsx(
          'p-2 rounded-md transition-colors',
          value === 'grid'
            ? 'bg-white dark:bg-dark-600 shadow-sm'
            : 'hover:bg-white/50 dark:hover:bg-dark-600/50'
        )}
        aria-label="卡片视图"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => onChange('list')}
        className={clsx(
          'p-2 rounded-md transition-colors',
          value === 'list'
            ? 'bg-white dark:bg-dark-600 shadow-sm'
            : 'hover:bg-white/50 dark:hover:bg-dark-600/50'
        )}
        aria-label="列表视图"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
