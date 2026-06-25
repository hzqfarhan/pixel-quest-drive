'use client';

import { useEffect, useState } from 'react';

interface PixelCoinProps {
  animate?: boolean;
  size?: number;
  className?: string;
}

export default function PixelCoin({ animate = false, size = 16, className = '' }: PixelCoinProps) {
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (animate) {
      setSpinning(true);
      const t = setTimeout(() => setSpinning(false), 600);
      return () => clearTimeout(t);
    }
  }, [animate]);

  return (
    <span
      className={`inline-block ${spinning ? 'animate-coin-spin' : ''} ${className}`}
      style={{ width: size, height: size, lineHeight: `${size}px`, fontSize: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hp/galleon.png"
        alt="Galleon"
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
      />
    </span>
  );
}
