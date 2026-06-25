'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { playAchievement } from '@/lib/pixel-audio';

export default function AchievementToast() {
  const { pendingAchievements, dismissAchievement } = useGameStore();
  const current = pendingAchievements[0];

  useEffect(() => {
    if (current) {
      playAchievement();
      const t = setTimeout(dismissAchievement, 5000);
      return () => clearTimeout(t);
    }
  }, [current, dismissAchievement]);

  if (!current) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] flex justify-center pointer-events-none"
      style={{ animation: 'achievement-slide-in 5s ease-in-out forwards' }}
    >
      <div
        className="pointer-events-auto mt-2 mx-4 max-w-lg w-full px-4 py-3 flex items-center gap-3"
        style={{
          border: '4px solid var(--pixel-yellow)',
          boxShadow: '6px 6px 0 var(--pixel-shadow), 0 0 20px rgba(255, 215, 0, 0.3)',
          background: 'var(--pixel-panel)',
        }}
      >
        {/* Icon */}
        <div className="text-3xl shrink-0">{current.emoji}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-[8px] font-pixel text-[var(--pixel-yellow)] animate-blink mb-0.5">
            ★ ACHIEVEMENT UNLOCKED ★
          </div>
          <div className="text-[10px] font-pixel font-bold text-[var(--text-primary)]">
            {current.name}
          </div>
          <div className="text-[7px] font-pixel text-[var(--pixel-gray)]">
            {current.description}
          </div>
        </div>

        {/* Rewards */}
        <div className="shrink-0 text-right">
          <div className="text-[9px] font-pixel text-[var(--pixel-yellow)] font-bold">
            +{current.xpReward} XP
          </div>
          <div className="text-[8px] font-pixel text-[var(--pixel-orange)]">
            +{current.coinReward} 🪙
          </div>
        </div>
      </div>
    </div>
  );
}
