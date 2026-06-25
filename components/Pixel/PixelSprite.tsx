'use client';

import { type PlayerClass } from '@/lib/gamification';

interface PixelSpriteProps {
  playerClass: PlayerClass;
  size?: number;
  walking?: boolean;
  className?: string;
}

export default function PixelSprite({
  playerClass,
  size = 32,
  walking = false,
  className = '',
}: PixelSpriteProps) {
  const getAssetSrc = () => {
    switch (playerClass) {
      case 'GRYFFINDOR': return '/assets/hp/gryffindor.png';
      case 'RAVENCLAW': return '/assets/hp/ravenclaw.png';
      case 'SLYTHERIN': return '/assets/hp/slytherin.png';
      case 'HUFFLEPUFF': return '/assets/hp/hufflepuff.png';
      default: return '/assets/hp/gryffindor.png';
    }
  };

  return (
    <div
      className={`inline-block ${walking ? 'animate-walk' : ''} ${className}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getAssetSrc()}
        alt={`${playerClass} Student`}
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
      />
    </div>
  );
}
