'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { playThunder } from '@/lib/pixel-audio';

export default function LivingEnvironment({ children }: { children: React.ReactNode }) {
  const { theme, weatherActive } = useGameStore();
  const isNight = theme === 'night';
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [flash, setFlash] = useState(false);

  // Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Weather System
  useEffect(() => {
    if (!weatherActive) return;
    const strike = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
      setTimeout(() => setFlash(true), 250);
      setTimeout(() => setFlash(false), 350);
      setTimeout(() => {
        import('@/lib/pixel-audio').then(m => m.playThunder());
      }, 800); // thunder delay
    };

    // random lightning every 15-30s during active weather
    const interval = setInterval(() => {
      if (Math.random() > 0.3) strike();
    }, 20000);

    return () => clearInterval(interval);
  }, [weatherActive]);

  const bgImage = isNight ? "url('/assets/hp/hogwarts-night.png')" : "url('/assets/hp/hogwarts-day.png')";

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden transition-all duration-1000"
      style={{
        backgroundColor: 'var(--pixel-bg)',
      }}
    >
      {/* Background with Parallax */}
      <div 
        style={{
          position: 'absolute',
          inset: '-20px', // bleed for parallax
          backgroundImage: bgImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          filter: 'var(--sky-filter)',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.1s ease-out, background-image 1s ease',
          zIndex: 0
        }}
      />

      {/* Lightning Flash overlay */}
      {flash && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'white',
          opacity: 0.8,
          zIndex: 9999,
          pointerEvents: 'none',
        }} />
      )}

      {/* Rain Overlay */}
      {weatherActive && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          backgroundImage: "url('/assets/hp/rain-overlay.png')",
          backgroundSize: '64px 64px',
          imageRendering: 'pixelated',
          animation: 'rainFall 0.4s linear infinite',
          opacity: isNight ? 0.4 : 0.6,
          pointerEvents: 'none'
        }} />
      )}

      {/* Fog Overlay (Night only) */}
      {isNight && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', zIndex: 3,
          backgroundImage: "url('/assets/hp/fog-overlay.png')",
          backgroundSize: '400px 100px',
          backgroundRepeat: 'repeat-x',
          imageRendering: 'pixelated',
          animation: 'fogDrift 30s linear infinite',
          opacity: 0.8,
          pointerEvents: 'none'
        }} />
      )}

      {/* Foreground Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
