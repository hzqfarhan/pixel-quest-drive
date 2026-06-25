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
      {/* Pixel coin SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Outer circle */}
        <rect x="4" y="0" width="8" height="2" fill="#DAA520" />
        <rect x="2" y="2" width="2" height="2" fill="#DAA520" />
        <rect x="12" y="2" width="2" height="2" fill="#DAA520" />
        <rect x="0" y="4" width="2" height="8" fill="#DAA520" />
        <rect x="14" y="4" width="2" height="8" fill="#DAA520" />
        <rect x="2" y="12" width="2" height="2" fill="#DAA520" />
        <rect x="12" y="12" width="2" height="2" fill="#DAA520" />
        <rect x="4" y="14" width="8" height="2" fill="#DAA520" />
        {/* Fill */}
        <rect x="4" y="2" width="8" height="12" fill="#FFD700" />
        <rect x="2" y="4" width="2" height="8" fill="#FFD700" />
        <rect x="12" y="4" width="2" height="8" fill="#FFD700" />
        {/* Dollar sign */}
        <rect x="7" y="3" width="2" height="10" fill="#DAA520" />
        <rect x="5" y="4" width="6" height="2" fill="#DAA520" />
        <rect x="5" y="7" width="6" height="2" fill="#DAA520" />
        <rect x="5" y="10" width="6" height="2" fill="#DAA520" />
        {/* Highlight */}
        <rect x="4" y="2" width="2" height="2" fill="#FFE44D" />
        <rect x="2" y="4" width="2" height="2" fill="#FFE44D" />
      </svg>
    </span>
  );
}
