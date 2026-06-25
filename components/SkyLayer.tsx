'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { playOpen, playLevelUp } from '@/lib/pixel-audio';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SkyEntity {
  id: string;
  type: 'broom' | 'owl' | 'snitch' | 'dementor' | 'dragon' | 'niffler' | 'peeves';
  assetKey: string;
  src: string;
  style: React.CSSProperties;
  clickable: boolean;
  direction: 'ltr' | 'rtl';
}

// ── Broom Rider Config ────────────────────────────────────────────────────────

const BROOM_CONFIGS = [
  { delay: '0s',   duration: '18s', top: '14%', scale: 1.0,  direction: 'ltr' as const },
  { delay: '8s',   duration: '24s', top: '22%', scale: 0.75, direction: 'rtl' as const },
  { delay: '15s',  duration: '20s', top: '9%',  scale: 1.15, direction: 'ltr' as const },
  { delay: '22s',  duration: '28s', top: '30%', scale: 0.6,  direction: 'rtl' as const },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SkyLayer() {
  const { theme, playerClass, gainXP, snitchLastCaught, setSnitchCaught } = useGameStore();
  const isNight = theme === 'night';
  const house = playerClass.toLowerCase();

  const [entities, setEntities] = useState<SkyEntity[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | undefined>(undefined);

  // ── Star Field Canvas (night only) ──────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isNight) return;

    const ctx = canvas.getContext('2d')!;
    
    // Set initial size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * star.speed + star.phase);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 220, 255, ${twinkle})`;
        ctx.fill();
      });
      t += 0.05;
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isNight]);

  // ── Snitch click handler ────────────────────────────────────────────────────

  const handleSnitchClick = useCallback(() => {
    const now = Date.now();
    const cooldown = 3 * 60 * 1000; // 3 minutes
    if (snitchLastCaught && now - snitchLastCaught < cooldown) return;

    setSnitchCaught(now);
    
    import('@/lib/pixel-audio').then(m => m.playSnitchCatch());
    
    // Remove snitch entity visually by saving state or triggering re-render, 
    // but SnitchEntity internal state handles its own animation lifecycle.
    // For simplicity, we just award points.
    gainXP(150, 25, '⚡ You caught the Golden Snitch!');
  }, [snitchLastCaught, setSnitchCaught, gainXP]);

  // ── Dementor click handler (Expecto Patronum) ───────────────────────────────

  const handleDementorClick = useCallback(() => {
    // Flash white overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(200,220,255,0.85);
      z-index:9999;pointer-events:none;transition:opacity 0.6s;
    `;
    document.body.appendChild(overlay);
    setTimeout(() => { overlay.style.opacity = '0'; }, 100);
    setTimeout(() => overlay.remove(), 700);

    gainXP(75, 5, '✨ Expecto Patronum!');
    import('@/lib/pixel-audio').then(m => m.playExpectoPatronum());

    // We can use a local state to hide dementor temporarily
    const dementor = document.getElementById('dementor-entity');
    if (dementor) dementor.style.display = 'none';
  }, [gainXP]);

  // ── Owl click handler ───────────────────────────────────────────────────────

  const handleOwlClick = useCallback(() => {
    gainXP(10, 0, '📜 Owl Post Received!');
    playOpen();
  }, [gainXP]);

  const houseKey = house.slice(0, 5) === 'gryff' ? 'gryff' : 
                   house.slice(0, 5) === 'raven' ? 'raven' : 
                   house.slice(0, 5) === 'slyth' ? 'slyth' : 'huffl';

  // Render
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Star Field */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isNight ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      />

      {/* Floating Candles (night only) */}
      {isNight && <FloatingCandles />}

      {/* Clouds (day only) */}
      {!isNight && (
        <div style={{
          position: 'absolute',
          top: '10%',
          width: '256px',
          height: '64px',
          backgroundImage: "url('/assets/hp/clouds-day.png')",
          imageRendering: 'pixelated',
          animation: 'cloudDrift 40s linear infinite',
          opacity: 0.8
        }} />
      )}

      {/* Broom Riders */}
      {BROOM_CONFIGS.map((cfg, i) => (
        <BroomRider
          key={i}
          config={cfg}
          src={`/assets/hp/broom-${houseKey}-${isNight ? 'night' : 'day'}.png`}
          isNight={isNight}
        />
      ))}

      {/* Owls */}
      <OwlEntity
        src={`/assets/hp/owl-${isNight ? 'night' : 'hedwig'}.png`}
        isNight={isNight}
        onClick={handleOwlClick}
      />

      {/* Golden Snitch (day only, after cooldown) */}
      {!isNight && (
        <SnitchEntity src="/assets/hp/golden-snitch.png" onClick={handleSnitchClick} />
      )}

      {/* Dementor (night only, rare) */}
      {isNight && (
        <DementorEntity src="/assets/hp/dementor.png" onClick={handleDementorClick} />
      )}

      {/* Dragon (ultra-rare, both modes) */}
      <DragonEntity src="/assets/hp/dragon-silhouette.png" isNight={isNight} />

      {/* Magic Particles */}
      <ParticleSystem isNight={isNight} />
    </div>
  );
}

// ── BroomRider ────────────────────────────────────────────────────────────────

function BroomRider({ config, src, isNight }: {
  config: typeof BROOM_CONFIGS[0]; src: string; isNight: boolean;
}) {
  const isRTL = config.direction === 'rtl';
  return (
    <div
      style={{
        position: 'absolute',
        top: config.top,
        left: 0,
        width: '32px',
        height: '32px',
        transform: `scale(${config.scale}) ${isRTL ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'center center',
        animation: `broomFly ${config.duration} ${config.delay} linear infinite`,
        filter: isNight
          ? `drop-shadow(0 0 5px #FFD700) drop-shadow(0 0 10px rgba(255,215,0,0.4))`
          : 'drop-shadow(1px 2px 1px rgba(0,0,0,0.4))',
        imageRendering: 'pixelated',
      }}
    >
      {/* Sprite sheet animation via background-position cycling */}
      <BroomSprite src={src} />
    </div>
  );
}

// ── BroomSprite (sprite sheet cycler) ─────────────────────────────────────────

function BroomSprite({ src }: { src: string }) {
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '128px 32px',
        imageRendering: 'pixelated',
        animation: 'spriteWalk 0.6s steps(4) infinite',
      }}
    />
  );
}

// ── OwlEntity ─────────────────────────────────────────────────────────────────

function OwlEntity({ src, onClick, isNight }: { src: string; onClick: () => void; isNight: boolean }) {
  return (
    <img onError={(e) => (e.currentTarget.style.display = 'none')}
      src={src}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '15%',
        left: '-50px',
        width: '32px',
        height: '32px',
        imageRendering: 'pixelated',
        pointerEvents: 'auto',
        cursor: 'pointer',
        animation: 'dragonFly 25s linear infinite 12s',
        filter: isNight ? 'brightness(0.8)' : 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))'
      }}
    />
  );
}

// ── SnitchEntity ──────────────────────────────────────────────────────────────

function SnitchEntity({ src, onClick }: { src: string; onClick: () => void }) {
  const [pos] = useState({
    top: `${Math.random() * 30 + 8}%`,
    left: `${Math.random() * 60 + 20}%`,
  });
  return (
    <img onError={(e) => (e.currentTarget.style.display = 'none')}
      src={src}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        width: '16px',
        height: '32px', // Sprite sheet 16x32? Assuming 16x16 per frame
        objectFit: 'cover',
        objectPosition: 'left top',
        imageRendering: 'pixelated',
        pointerEvents: 'auto',
        cursor: 'pointer',
        animation: 'snitchDrift 4s ease-in-out infinite, snitchGlow 1.5s ease-in-out infinite alternate',
        zIndex: 10,
      }}
    />
  );
}

// ── DementorEntity ────────────────────────────────────────────────────────────

function DementorEntity({ src, onClick }: { src: string; onClick: () => void }) {
  return (
    <img
      id="dementor-entity"
      src={src}
      onError={(e) => (e.currentTarget.style.display = 'none')}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '20%',
        left: '-60px',
        width: '32px',
        height: '48px', // Using object position for sprite if needed
        objectFit: 'cover',
        objectPosition: 'left top',
        imageRendering: 'pixelated',
        pointerEvents: 'auto',
        cursor: 'crosshair',
        animation: 'dementorApproach 40s linear infinite 5s',
        filter: 'brightness(0.7) contrast(1.2)',
        zIndex: 8,
      }}
    />
  );
}

// ── DragonEntity (ultra-rare) ─────────────────────────────────────────────────

function DragonEntity({ src, isNight }: { src: string; isNight: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // 2% chance to appear every 5 minutes
    const check = () => { if (Math.random() < 0.05) setVisible(true); };
    const interval = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!visible) return null;
  return (
    <img
      src={src}
      onError={(e) => (e.currentTarget.style.display = 'none')}
      onAnimationEnd={() => setVisible(false)}
      style={{
        position: 'absolute',
        top: '5%',
        left: 0,
        width: '64px',
        height: '64px', // single frame size from 256x64 sprite sheet?
        objectFit: 'cover',
        objectPosition: 'left top',
        imageRendering: 'pixelated',
        pointerEvents: 'none',
        animation: 'dragonFly 12s linear forwards',
        filter: isNight
          ? 'drop-shadow(0 0 8px rgba(255, 100, 0, 0.6))'
          : 'drop-shadow(2px 3px 2px rgba(0,0,0,0.5))',
        zIndex: 5,
      }}
    />
  );
}

// ── FloatingCandles (night) ───────────────────────────────────────────────────

function FloatingCandles() {
  const candles = [
    { left: '15%', animDelay: '0s' },
    { left: '35%', animDelay: '0.8s' },
    { left: '60%', animDelay: '1.4s' },
    { left: '80%', animDelay: '0.3s' },
  ];
  return (
    <>
      {candles.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '6%',
            left: c.left,
            width: '16px',
            height: '32px',
            backgroundImage: "url('/assets/hp/floating-candles.png')",
            backgroundSize: '64px 32px',
            imageRendering: 'pixelated',
            animation: `candleFloat 5s ease-in-out ${c.animDelay} infinite alternate, spriteWalk 0.6s steps(2) infinite`,
          }}
        />
      ))}
    </>
  );
}

// ── ParticleSystem ────────────────────────────────────────────────────────────

function ParticleSystem({ isNight }: { isNight: boolean }) {
  const chars = isNight ? ['✦', '·', '✧', '★'] : ['✦', '✨', '⭐', '💫'];
  const [particles] = useState(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    char: chars[i % chars.length],
    left: `${Math.random() * 90 + 5}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${Math.random() * 6 + 6}s`,
    opacity: Math.random() * 0.4 + 0.1,
    size: Math.random() * 8 + 8,
  })));
  
  return (
    <>
      {particles.map(p => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: p.left,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            color: isNight ? '#a0a0e0' : '#FFD700',
            animation: `particleDrift ${p.duration} ${p.delay} ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        >
          {p.char}
        </span>
      ))}
    </>
  );
}
