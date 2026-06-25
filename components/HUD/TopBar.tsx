'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { getRankTitle, getClassColor } from '@/lib/gamification';
import { isSoundEnabled, setSoundEnabled } from '@/lib/pixel-audio';
import PixelProgressBar from '@/components/Pixel/PixelProgressBar';
import PixelCoin from '@/components/Pixel/PixelCoin';
import PixelSprite from '@/components/Pixel/PixelSprite';

interface TopBarProps {
  onSearchClick: () => void;
}

export default function TopBar({ onSearchClick }: TopBarProps) {
  const {
    playerName, playerClass, level, currentXP, xpToNext,
    hp, maxHp, mp, maxMp, coins, theme, setTheme
  } = useGameStore();

  const [soundOn, setSoundOn] = useState(true);
  const [sessionTime, setSessionTime] = useState('00:00');
  const [coinAnimate, setCoinAnimate] = useState(false);
  const [prevCoins, setPrevCoins] = useState(coins);

  // Sound toggle
  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  // Session timer
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const secs = (elapsed % 60).toString().padStart(2, '0');
      setSessionTime(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Coin animation trigger
  useEffect(() => {
    if (coins > prevCoins) {
      setCoinAnimate(true);
      setTimeout(() => setCoinAnimate(false), 700);
    }
    setPrevCoins(coins);
  }, [coins, prevCoins]);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
  };

  const classColor = getClassColor(playerClass);
  const rank = getRankTitle(level);
  const nearLevelUp = currentXP / xpToNext > 0.8;

  return (
    <header
      className="sticky top-0 z-50 px-border"
      style={{
        background: 'var(--pixel-panel)',
        borderBottom: '4px solid var(--pixel-black)',
        boxShadow: '0 4px 0 var(--pixel-shadow)',
      }}
    >
      <div className="flex items-center gap-3 px-3 py-2 flex-wrap">
        {/* Logo + Sprite */}
        <div className="flex items-center gap-2 min-w-0">
          <PixelSprite playerClass={playerClass} size={28} />
          <div className="hidden sm:block">
            <div className="text-[10px] font-pixel text-[var(--pixel-black)] flex items-center gap-1">
              <span className="hidden md:inline">HOGWARTS</span>
              <span className="text-[var(--pixel-yellow)]">DRIVE</span>
              <span className="animate-blink text-[var(--pixel-yellow)]">▮</span>
            </div>
          </div>
        </div>

        {/* Player info */}
        <div className="flex items-center gap-1 text-[8px] font-pixel">
          <span style={{ color: classColor }}>{playerClass}</span>
          <span className="text-[var(--pixel-gray)]">·</span>
          <span>{playerName}</span>
        </div>

        {/* Level badge */}
        <div
          className={`px-2 py-1 text-[9px] font-pixel font-bold ${nearLevelUp ? 'animate-pulse-glow' : ''}`}
          style={{
            border: '3px solid var(--pixel-black)',
            background: nearLevelUp ? 'var(--pixel-yellow)' : 'var(--pixel-panel)',
            boxShadow: '2px 2px 0 var(--pixel-shadow)',
            color: 'var(--pixel-black)',
          }}
        >
          LV.{level}
        </div>

        {/* Bars */}
        <div className="flex-1 flex flex-col gap-1 min-w-[120px] max-w-[280px]">
          <PixelProgressBar label="HP" value={hp} max={maxHp} color="var(--pixel-red)" height={14} />
          <PixelProgressBar label="PTS" value={currentXP} max={xpToNext} color="var(--pixel-yellow)" height={14} />
          <PixelProgressBar label="MANA" value={mp} max={maxMp} color="var(--pixel-blue)" height={10} showText={false} />
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1 text-[10px] font-pixel font-bold text-[var(--pixel-yellow)]">
          <PixelCoin animate={coinAnimate} size={14} />
          <span>{coins}</span>
        </div>

        {/* Timer */}
        <div className="hidden lg:flex items-center gap-1 text-[8px] font-pixel text-[var(--pixel-gray)]">
          <span>⏱</span>
          <span>{sessionTime}</span>
        </div>

        {/* Rank */}
        <div className="hidden xl:block text-[7px] font-pixel text-[var(--pixel-purple)]">
          [{rank}]
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'day' ? 'night' : 'day')}
            className="px-btn bg-[var(--pixel-panel)] px-2 py-1 text-[10px]"
            title={theme === 'day' ? 'Switch to Night' : 'Switch to Day'}
          >
            {theme === 'day' ? '🌙' : '☀️'}
          </button>

          {/* Search spell button */}
          <button
            onClick={onSearchClick}
            className="px-btn bg-[var(--pixel-purple)] text-white px-2 py-1 text-[8px] font-pixel flex items-center gap-1"
            title="Revelio Spell (5 MANA)"
          >
            <span>🔮</span>
            <span className="hidden sm:inline">REVELIO</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="px-btn bg-[var(--pixel-panel)] px-2 py-1 text-[10px]"
            title={soundOn ? 'Mute' : 'Unmute'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    </header>
  );
}
