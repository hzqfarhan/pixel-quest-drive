'use client';

import { type PlayerClass } from '@/lib/gamification';

interface PixelSpriteProps {
  playerClass: PlayerClass;
  size?: number;
  walking?: boolean;
  className?: string;
}

/** 32x32 pixel character sprites as SVGs for each class */
export default function PixelSprite({
  playerClass,
  size = 32,
  walking = false,
  className = '',
}: PixelSpriteProps) {
  return (
    <div
      className={`inline-block ${walking ? 'animate-walk' : ''} ${className}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {playerClass === 'WARRIOR' && <WarriorSprite />}
        {playerClass === 'MAGE' && <MageSprite />}
        {playerClass === 'ROGUE' && <RogueSprite />}
        {playerClass === 'BARD' && <BardSprite />}
      </svg>
    </div>
  );
}

function WarriorSprite() {
  return (
    <g>
      {/* Helmet */}
      <rect x="10" y="2" width="12" height="4" fill="#B0B0B0" />
      <rect x="8" y="4" width="16" height="2" fill="#B0B0B0" />
      <rect x="14" y="0" width="4" height="2" fill="#FF5252" />
      {/* Face */}
      <rect x="10" y="6" width="12" height="8" fill="#FFDAB9" />
      <rect x="12" y="8" width="2" height="2" fill="#1a1a2e" />
      <rect x="18" y="8" width="2" height="2" fill="#1a1a2e" />
      <rect x="14" y="11" width="4" height="1" fill="#1a1a2e" />
      {/* Armor body */}
      <rect x="8" y="14" width="16" height="10" fill="#CC3333" />
      <rect x="12" y="14" width="8" height="2" fill="#B0B0B0" />
      <rect x="14" y="16" width="4" height="4" fill="#B0B0B0" />
      {/* Arms */}
      <rect x="4" y="14" width="4" height="8" fill="#CC3333" />
      <rect x="24" y="14" width="4" height="8" fill="#CC3333" />
      {/* Sword */}
      <rect x="26" y="6" width="2" height="12" fill="#C0C0C0" />
      <rect x="24" y="12" width="6" height="2" fill="#8B7355" />
      {/* Legs */}
      <rect x="10" y="24" width="4" height="6" fill="#1a1a2e" />
      <rect x="18" y="24" width="4" height="6" fill="#1a1a2e" />
      {/* Boots */}
      <rect x="8" y="28" width="6" height="4" fill="#8B4513" />
      <rect x="18" y="28" width="6" height="4" fill="#8B4513" />
    </g>
  );
}

function MageSprite() {
  return (
    <g>
      {/* Hat */}
      <rect x="14" y="0" width="4" height="2" fill="#9B59B6" />
      <rect x="12" y="2" width="8" height="2" fill="#9B59B6" />
      <rect x="10" y="4" width="12" height="2" fill="#9B59B6" />
      <rect x="14" y="2" width="4" height="2" fill="#FFD700" />
      {/* Face */}
      <rect x="10" y="6" width="12" height="8" fill="#FFDAB9" />
      <rect x="12" y="8" width="2" height="2" fill="#1a1a2e" />
      <rect x="18" y="8" width="2" height="2" fill="#1a1a2e" />
      <rect x="14" y="10" width="4" height="2" fill="#E0E0E0" />
      {/* Robe */}
      <rect x="8" y="14" width="16" height="12" fill="#7D3C98" />
      <rect x="12" y="14" width="8" height="2" fill="#9B59B6" />
      <rect x="6" y="16" width="4" height="6" fill="#7D3C98" />
      <rect x="22" y="16" width="4" height="6" fill="#7D3C98" />
      {/* Stars on robe */}
      <rect x="11" y="18" width="2" height="2" fill="#FFD700" />
      <rect x="19" y="20" width="2" height="2" fill="#FFD700" />
      {/* Staff */}
      <rect x="4" y="8" width="2" height="18" fill="#8B4513" />
      <rect x="2" y="6" width="6" height="4" fill="#9B59B6" />
      <rect x="4" y="4" width="2" height="2" fill="#FFD700" />
      {/* Legs/Feet */}
      <rect x="10" y="26" width="4" height="4" fill="#4A235A" />
      <rect x="18" y="26" width="4" height="4" fill="#4A235A" />
      <rect x="8" y="28" width="6" height="4" fill="#4A235A" />
      <rect x="18" y="28" width="6" height="4" fill="#4A235A" />
    </g>
  );
}

function RogueSprite() {
  return (
    <g>
      {/* Hood */}
      <rect x="10" y="2" width="12" height="4" fill="#2E7D32" />
      <rect x="8" y="4" width="16" height="4" fill="#2E7D32" />
      {/* Face (partially hidden) */}
      <rect x="10" y="6" width="12" height="8" fill="#FFDAB9" />
      <rect x="10" y="10" width="12" height="4" fill="#1B5E20" />
      <rect x="12" y="8" width="2" height="2" fill="#1a1a2e" />
      <rect x="18" y="8" width="2" height="2" fill="#1a1a2e" />
      {/* Body */}
      <rect x="8" y="14" width="16" height="10" fill="#388E3C" />
      <rect x="12" y="14" width="8" height="2" fill="#2E7D32" />
      {/* Belt */}
      <rect x="8" y="20" width="16" height="2" fill="#8B4513" />
      <rect x="14" y="19" width="4" height="4" fill="#FFD700" />
      {/* Arms */}
      <rect x="4" y="14" width="4" height="8" fill="#388E3C" />
      <rect x="24" y="14" width="4" height="8" fill="#388E3C" />
      {/* Daggers */}
      <rect x="2" y="18" width="2" height="6" fill="#C0C0C0" />
      <rect x="28" y="18" width="2" height="6" fill="#C0C0C0" />
      {/* Legs */}
      <rect x="10" y="24" width="4" height="6" fill="#2E4A30" />
      <rect x="18" y="24" width="4" height="6" fill="#2E4A30" />
      <rect x="8" y="28" width="6" height="4" fill="#5D4037" />
      <rect x="18" y="28" width="6" height="4" fill="#5D4037" />
    </g>
  );
}

function BardSprite() {
  return (
    <g>
      {/* Hat with feather */}
      <rect x="10" y="2" width="12" height="4" fill="#F5C842" />
      <rect x="8" y="4" width="16" height="2" fill="#F5C842" />
      <rect x="20" y="0" width="2" height="4" fill="#FF5252" />
      <rect x="22" y="0" width="2" height="2" fill="#FF5252" />
      {/* Face */}
      <rect x="10" y="6" width="12" height="8" fill="#FFDAB9" />
      <rect x="12" y="8" width="2" height="2" fill="#1a1a2e" />
      <rect x="18" y="8" width="2" height="2" fill="#1a1a2e" />
      <rect x="13" y="11" width="6" height="1" fill="#E57373" />
      {/* Fancy shirt */}
      <rect x="8" y="14" width="16" height="10" fill="#E8874A" />
      <rect x="12" y="14" width="8" height="3" fill="#FFF176" />
      <rect x="14" y="17" width="4" height="2" fill="#FFF176" />
      {/* Arms */}
      <rect x="4" y="14" width="4" height="8" fill="#E8874A" />
      <rect x="24" y="14" width="4" height="8" fill="#E8874A" />
      {/* Lute */}
      <rect x="24" y="16" width="6" height="8" fill="#8B4513" />
      <rect x="26" y="18" width="2" height="4" fill="#D4A574" />
      <rect x="28" y="12" width="2" height="6" fill="#8B4513" />
      {/* Legs */}
      <rect x="10" y="24" width="4" height="6" fill="#6D4C2E" />
      <rect x="18" y="24" width="4" height="6" fill="#6D4C2E" />
      <rect x="8" y="28" width="6" height="4" fill="#5D4037" />
      <rect x="18" y="28" width="6" height="4" fill="#5D4037" />
    </g>
  );
}
