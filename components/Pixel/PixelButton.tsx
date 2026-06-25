'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold' | 'green';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const VARIANT_STYLES = {
  primary: 'bg-[var(--pixel-blue)] text-[var(--text-primary)]',
  secondary: 'bg-[var(--pixel-panel)] text-[var(--text-primary)]',
  danger: 'bg-[var(--pixel-red)] text-white',
  gold: 'bg-[var(--pixel-yellow)] text-[var(--text-primary)]',
  green: 'bg-[var(--pixel-green)] text-white',
};

const SIZE_STYLES = {
  sm: 'px-2 py-1 text-[8px]',
  md: 'px-4 py-2 text-[10px]',
  lg: 'px-6 py-3 text-[12px]',
};

export default function PixelButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={`px-btn ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} font-pixel uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
