'use client';

import { useEffect, useState } from 'react';

interface PixelNotificationProps {
  message: string;
  xp?: number;
  coins?: number;
  onDone?: () => void;
}

export default function PixelNotification({
  message,
  xp,
  coins,
  onDone,
}: PixelNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none font-pixel text-center"
      style={{ animation: 'px-xp-pop 1.8s ease-out forwards' }}
    >
      <div className="text-[10px] font-bold" style={{ color: 'var(--pixel-yellow)', textShadow: '2px 2px 0 var(--pixel-black)' }}>
        {xp && xp > 0 && <span>+{xp} XP </span>}
        {coins && coins > 0 && <span className="text-[var(--pixel-orange)]">+{coins} 🪙 </span>}
      </div>
      <div className="text-[8px] text-[var(--pixel-black)]" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>
        {message}
      </div>
    </div>
  );
}
