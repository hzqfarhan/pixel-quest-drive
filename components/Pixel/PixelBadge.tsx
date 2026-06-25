'use client';

import { type Rarity, getRarityBadgeColors } from '@/lib/rarity';

interface PixelBadgeProps {
  rarity: Rarity;
  className?: string;
}

export default function PixelBadge({ rarity, className = '' }: PixelBadgeProps) {
  const colors = getRarityBadgeColors(rarity);

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[7px] font-pixel uppercase border-2 border-[var(--pixel-shadow)] ${className}`}
      style={{
        background: colors.bg,
        color: colors.text,
        boxShadow: '2px 2px 0 var(--pixel-shadow)',
      }}
    >
      {rarity}
    </span>
  );
}
