# 🏰 Hogwarts Drive — Full Visual Enhancement Implementation Prompt

> **Copy-paste this entire document** into your AI coding session or hand it to your developer.
> Built on top of the existing Next.js 14 / Zustand / `styles/pixel.css` stack.
> Do **not** break existing functionality. All additions are additive layers.

---

## 📋 TABLE OF CONTENTS

1. [Pixellab Image Generation — Full Asset List](#1-pixellab-image-generation--full-asset-list)
2. [GIF Sprite Animation System](#2-gif-sprite-animation-system)
3. [Asset Caching Layer](#3-asset-caching-layer)
4. [Day/Night UI Contrast Overhaul](#4-daynight-ui-contrast-overhaul)
5. [SkyLayer Component — Broom Riders + Entities](#5-skylayer-component--broom-riders--entities)
6. [Living Environment Details](#6-living-environment-details)
7. [Day↔Night Cinematic Transitions](#7-daynight-cinematic-transitions)
8. [New Audio Cues](#8-new-audio-cues)
9. [Zustand State Extensions](#9-zustand-state-extensions)
10. [Acceptance Criteria](#10-acceptance-criteria)

---

## 1. Pixellab Image Generation — Full Asset List

Call the Pixellab API **once per asset on first load**, then cache to `localStorage` as base64.
All assets: **16-bit pixel art style, transparent PNG background** unless noted.

### 1.1 — Broom Riders (Animated Sprite Sheets)

| Key | Size | Frames | Prompt |
|---|---|---|---|
| `broom-gryf-day` | 128×32 | 4 | `"Gryffindor wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, scarlet and gold robes, bright daytime sky, 32x32 per frame, 16-bit pixel art, transparent background"` |
| `broom-gryf-night` | 128×32 | 4 | `"Gryffindor wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, scarlet and gold robes, glowing golden wand tip, dark starry night, 32x32 per frame, 16-bit pixel art, transparent background"` |
| `broom-slyt-day` | 128×32 | 4 | `"Slytherin wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, green and silver robes, bright daytime sky, 32x32 per frame, 16-bit pixel art, transparent background"` |
| `broom-slyt-night` | 128×32 | 4 | `"Slytherin wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, green and silver robes, green glowing wand, dark night sky, 32x32 per frame, 16-bit pixel art, transparent background"` |
| `broom-raven-day` | 128×32 | 4 | `"Ravenclaw wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, blue and bronze robes, bright daytime sky, 32x32 per frame, 16-bit pixel art, transparent background"` |
| `broom-huffl-day` | 128×32 | 4 | `"Hufflepuff wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, yellow and black robes, bright daytime sky, 32x32 per frame, 16-bit pixel art, transparent background"` |

> **Sprite sheet slicing:** Each sheet is 128×32. Render via CSS `background-position` animation cycling through offsets `0px`, `-32px`, `-64px`, `-96px` at 150ms intervals to produce walking motion.

---

### 1.2 — Owls

| Key | Size | Frames | Prompt |
|---|---|---|---|
| `owl-hedwig` | 96×32 | 3 | `"Hedwig white snowy owl in flight, 3-frame wing-flap animation sprite sheet, 32x32 per frame, carrying letter in talons, 16-bit pixel art, transparent background"` |
| `owl-brown` | 96×32 | 3 | `"Brown barn owl in flight, 3-frame wing-flap animation sprite sheet, 32x32 per frame, carrying sealed letter, 16-bit pixel art, transparent background"` |
| `owl-night` | 96×32 | 3 | `"Tawny owl in flight at night, 3-frame wing-flap animation sprite sheet, 32x32 per frame, glowing amber eyes, 16-bit pixel art, transparent background"` |

---

### 1.3 — Magical Creatures & Entities

| Key | Size | Prompt |
|---|---|---|
| `golden-snitch` | 64×32 | `"Golden snitch with fluttering wings, 2-frame hover animation sprite sheet, 16x32 per frame, metallic gold #FFD700, motion blur on wings, 16-bit pixel art, transparent background"` |
| `dementor` | 64×96 | `"Dementor floating menacingly, 2-frame idle animation sprite sheet, 32x96 per frame, black tattered robes, dark shadowy aura, face hidden, 16-bit pixel art, transparent background"` |
| `patronus-stag` | 128×64 | `"Patronus stag leaping, 4-frame animation sprite sheet, 32x64 per frame, glowing silver-blue ethereal light, transparent ghostly body, 16-bit pixel art, transparent background"` |
| `niffler` | 64×32 | `"Niffler creature running left-to-right, 2-frame run cycle, 32x32 per frame, platypus-like snout, black fur, carrying galleon coin in pouch, 16-bit pixel art, transparent background"` |
| `peeves` | 64×32 | `"Peeves the poltergeist floating, 2-frame bounce animation sprite sheet, 32x32 per frame, jester hat, mischievous grin, translucent ghost, 16-bit pixel art, transparent background"` |
| `dragon-silhouette` | 256×64 | `"Dragon flying silhouette across sky, 4-frame wing-flap sprite sheet, 64x64 per frame, dark shadow silhouette, large wingspan, 16-bit pixel art, transparent background — rare event only"` |
| `mermaid` | 64×64 | `"Mermaid peeking out of water, 2-frame idle, 32x64 per frame, scales, flowing hair, 16-bit pixel art, transparent background — used as Easter egg in file preview modal"` |

---

### 1.4 — Environment & Weather

| Key | Size | Prompt |
|---|---|---|
| `rain-overlay` | 64×64 | `"Pixel rain tileable texture, diagonal falling raindrops, 2-frame animation, 64x64 tileable, dark blue drops, 16-bit pixel art, transparent background"` |
| `lightning-bolt` | 32×64 | `"Lightning bolt strike, single frame, jagged white and yellow bolt, 16-bit pixel art, transparent background — flashes briefly then disappears"` |
| `candle-flame` | 32×64 | `"Floating candle with animated flame, 3-frame flicker animation sprite sheet, 16x64 per frame, warm orange-yellow flame, dripping wax, 16-bit pixel art, transparent background"` |
| `floating-candles` | 128×64 | `"Four floating candles in a row, each with flickering flame, 2-frame animation sprite sheet, 128x64, warm candlelight glow, Great Hall style, 16-bit pixel art, transparent background"` |
| `moon-full` | 64×64 | `"Full moon with craters, glowing golden-white aura, single frame, 64x64, 16-bit pixel art, transparent background"` |
| `moon-crescent` | 64×64 | `"Crescent moon, silver glow, single frame, 64x64, 16-bit pixel art, transparent background"` |
| `sun-pixel` | 64×64 | `"Pixel art sun with animated rays, 2-frame spin animation, 64x64, bright yellow-gold, 16-bit pixel art, transparent background"` |
| `clouds-day` | 256×64 | `"Fluffy white pixel clouds drifting, 2-frame animation, 256x64, light blue tint on shadows, 16-bit pixel art, transparent background"` |
| `clouds-storm` | 256×64 | `"Dark stormy pixel clouds, 2-frame rumble animation, 256x64, dark grey and purple, 16-bit pixel art, transparent background"` |

---

### 1.5 — UI Decoration Sprites

| Key | Size | Prompt |
|---|---|---|
| `torch-wall` | 32×64 | `"Wall-mounted torch with animated flame, 3-frame flicker, 16x64 per frame, stone bracket, warm orange fire, 16-bit pixel art, transparent background"` |
| `magic-sparkle` | 48×16 | `"Magic sparkle burst, 3-frame animation sprite sheet, 16x16 per frame, gold and white star sparks, 16-bit pixel art, transparent background"` |
| `spell-cast` | 96×32 | `"Magic spell bolt shooting right, 3-frame animation, 32x32 per frame, purple and blue energy bolt, trailing sparks, 16-bit pixel art, transparent background"` |
| `potion-bubble` | 64×32 | `"Cauldron bubble popping, 2-frame animation, 32x32 per frame, green bubbling liquid, 16-bit pixel art, transparent background"` |
| `xp-pop` | 64×16 | `"Floating XP text pop animation, 4-frame, 16x16 per frame, gold text floating upward fading out, 16-bit pixel art, transparent background"` |
| `envelope-open` | 64×32 | `"Hogwarts letter envelope opening, 2-frame animation, 32x32 per frame, wax seal with H crest, cream parchment letter visible, 16-bit pixel art, transparent background"` |
| `chest-open` | 64×32 | `"Treasure chest opening with sparkle, 2-frame, 32x32 per frame, wooden chest with gold trim, light burst on open, 16-bit pixel art, transparent background"` |

---

### 1.6 — Background Accents (Non-transparent)

| Key | Size | Prompt |
|---|---|---|
| `stars-layer` | 400×225 | `"Starfield background tile, 400x225, dark navy #0d0d1a base, 80+ varying-size white and pale blue stars, 3–4 larger stars with soft glow halos, 16-bit pixel art style, no transparent pixels"` |
| `aurora-layer` | 400×225 | `"Northern lights / aurora borealis pixel art, 400x225, flowing green and purple ribbons across dark sky, 16-bit pixel art style, dark background"` |
| `fog-overlay` | 400×100 | `"Ground fog mist overlay, 400x100, wispy white-grey fog rolling across bottom of screen, 16-bit pixel art style, transparent top, opaque mist at bottom"` |

---

## 2. GIF Sprite Animation System

Rather than CSS sprite sheets for all assets, generate **true animated GIFs** for creatures that need looping motion. Use Pixellab's GIF export mode where supported, otherwise assemble frames client-side.

### 2.1 — GIF Generation via Pixellab

```typescript
// lib/pixel-gif.ts
export async function generateAnimatedGif(
  frames: string[], // base64 PNG frames
  frameDelayMs: number = 150
): Promise<string> {
  // Use gif.js (npm install gif.js) to assemble frames client-side
  const GIF = (await import('gif.js')).default;
  return new Promise((resolve) => {
    const gif = new GIF({ workers: 2, quality: 10, transparent: 0x00000000 });
    frames.forEach(frame => {
      const img = new Image();
      img.src = `data:image/png;base64,${frame}`;
      gif.addFrame(img, { delay: frameDelayMs });
    });
    gif.on('finished', (blob: Blob) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    gif.render();
  });
}
```

### 2.2 — GIF Assets to Request Directly (if Pixellab supports animated output)

Request these as animated GIF exports from Pixellab at 4–6 fps:

| GIF Key | Description |
|---|---|
| `gif-broom-fly` | 4-frame broom rider side-scroll loop |
| `gif-owl-flap` | 3-frame owl wing flap loop |
| `gif-snitch-hover` | 2-frame golden snitch hover |
| `gif-dementor-drift` | 2-frame dementor cloak flutter |
| `gif-candle-flicker` | 3-frame candle flame flicker |
| `gif-patronus-leap` | 4-frame stag patronus gallop |
| `gif-dragon-fly` | 4-frame dragon silhouette wing-flap |
| `gif-niffler-run` | 2-frame niffler scurry |
| `gif-rain-fall` | 2-frame diagonal rain tile |
| `gif-sparkle-burst` | 3-frame magic sparkle pop |

---

## 3. Asset Caching Layer

Create `lib/pixel-assets.ts` — all generation and retrieval goes through here.

```typescript
// lib/pixel-assets.ts
const CACHE_KEY = 'hogwarts-drive-assets-v2';
const CACHE_VERSION = 2; // bump to invalidate all cached assets

interface AssetCache {
  version: number;
  assets: Record<string, string>; // key → base64 data URL
}

function getCache(): AssetCache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed: AssetCache = raw ? JSON.parse(raw) : null;
    if (parsed?.version === CACHE_VERSION) return parsed;
  } catch {}
  return { version: CACHE_VERSION, assets: {} };
}

function saveCache(cache: AssetCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('[HogwartsDrive] Asset cache full, clearing old entries');
    localStorage.removeItem(CACHE_KEY);
  }
}

export async function getOrGenerateAsset(
  key: string,
  prompt: string,
  options: { width?: number; height?: number; format?: 'png' | 'gif' } = {}
): Promise<string> {
  const cache = getCache();
  if (cache.assets[key]) return cache.assets[key];

  const base64 = await callPixellabAPI(prompt, options);
  cache.assets[key] = base64;
  saveCache(cache);
  return base64;
}

export async function preloadAllAssets(house: 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff'): Promise<void> {
  const houseKey = house.slice(0, 5); // 'gryff', 'raven', 'slyt', 'huffl'
  const isDayAssets = [
    [`broom-${houseKey}-day`, `... (prompt from table above)`],
    [`owl-hedwig`, `... (prompt from table above)`],
    [`golden-snitch`, `... (prompt from table above)`],
    [`candle-flame`, `... (prompt from table above)`],
    [`floating-candles`, `... (prompt from table above)`],
    [`torch-wall`, `... (prompt from table above)`],
    [`magic-sparkle`, `... (prompt from table above)`],
    [`clouds-day`, `... (prompt from table above)`],
    [`sun-pixel`, `... (prompt from table above)`],
    [`moon-full`, `... (prompt from table above)`],
    [`moon-crescent`, `... (prompt from table above)`],
    [`stars-layer`, `... (prompt from table above)`],
  ];

  // Load in parallel batches of 3 to avoid rate limiting
  for (let i = 0; i < isDayAssets.length; i += 3) {
    const batch = isDayAssets.slice(i, i + 3);
    await Promise.all(batch.map(([key, prompt]) => getOrGenerateAsset(key, prompt)));
  }
}

// Call this lazily — load night assets only when user first toggles night mode
export async function preloadNightAssets(): Promise<void> {
  const nightAssets = [
    [`broom-gryf-night`, `...`],
    [`dementor`, `...`],
    [`owl-night`, `...`],
    [`aurora-layer`, `...`],
    [`stars-layer`, `...`],
  ];
  await Promise.all(nightAssets.map(([key, prompt]) => getOrGenerateAsset(key, prompt)));
}
```

---

## 4. Day/Night UI Contrast Overhaul

### 4.1 — CSS Variable System (`styles/pixel.css`)

Add a `[data-theme]` attribute to `<html>`. The toggle button writes to this attribute AND to Zustand.

```css
/* ===== BASE TOKENS (Day — default) ===== */
:root {
  --pixel-bg:            #FFFFF0;
  --pixel-panel:         #FFF8E7;
  --pixel-white:         #FFFFF0;
  --pixel-shadow:        #000000;
  --panel-border:        #c8b870;
  --panel-border-inner:  #e8d890;
  --torch-glow:          transparent;
  --sky-filter:          brightness(1) saturate(1);
  --text-primary:        #1a1a2e;
  --text-secondary:      #5a4a20;
  --hp-bar-bg:           #8B0000;
  --xp-bar-bg:           #4a3a00;
  --mana-bar-bg:         #003a6a;
  --transition-theme:    background-color 1.2s ease, color 0.8s ease,
                         border-color 0.8s ease, box-shadow 0.8s ease;
}

/* ===== NIGHT MODE OVERRIDES ===== */
[data-theme="night"] {
  --pixel-bg:            #0d0d1a;
  --pixel-panel:         #16162a;
  --pixel-white:         #c8c8e8;
  --pixel-shadow:        #000033;
  --panel-border:        #3a3a6e;
  --panel-border-inner:  #2a2a4a;
  --torch-glow:          rgba(255, 140, 20, 0.22);
  --sky-filter:          brightness(0.85) saturate(0.7);
  --text-primary:        #e8e8f8;
  --text-secondary:      #9090c0;
  --hp-bar-bg:           #5a0000;
  --xp-bar-bg:           #2a2000;
  --mana-bar-bg:         #001a3a;
}

/* ===== APPLY TRANSITIONS TO KEY ELEMENTS ===== */
body, .px-panel, .px-topbar, .px-file-card, .px-modal {
  transition: var(--transition-theme);
  background-color: var(--pixel-panel);
  color: var(--text-primary);
  border-color: var(--panel-border);
}

/* ===== TORCH GLOW ON PANELS (night only) ===== */
[data-theme="night"] .px-panel {
  position: relative;
  box-shadow:
    inset 0 0 20px var(--torch-glow),
    0 4px 0 var(--pixel-shadow);
}

[data-theme="night"] .px-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 32px var(--torch-glow);
  animation: torchFlicker 2.8s ease-in-out infinite alternate;
  border-radius: inherit;
}

@keyframes torchFlicker {
  0%   { opacity: 0.5; }
  30%  { opacity: 0.9; }
  60%  { opacity: 0.6; }
  80%  { opacity: 1.0; }
  100% { opacity: 0.65; }
}

/* ===== TOPBAR NIGHT MOOD ===== */
[data-theme="night"] .px-topbar {
  background: linear-gradient(180deg, #0d0d22 0%, #16162e 100%);
  border-bottom: 2px solid #3a3a6e;
}

/* ===== FILE CARDS NIGHT MOOD ===== */
[data-theme="night"] .px-file-card {
  background: #1a1a30;
  border-color: #3a3a6e;
  filter: var(--sky-filter);
}

[data-theme="night"] .px-file-card:hover {
  border-color: #ffd700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.3), 0 4px 0 #000;
}

/* ===== REDUCED MOTION SAFETY ===== */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

### 4.2 — Toggle Handler in `TopBar.tsx`

```tsx
// In TopBar.tsx
import { useGameStore } from '@/store/gameStore';
import { preloadNightAssets } from '@/lib/pixel-assets';

const { isNight, setNight } = useGameStore();

const handleThemeToggle = async () => {
  const newMode = !isNight;
  
  // Trigger cinematic transition (see Section 7)
  await triggerThemeTransition(newMode);
  
  // Lazily load night assets on first toggle
  if (newMode) {
    preloadNightAssets(); // non-blocking
  }
  
  document.documentElement.setAttribute('data-theme', newMode ? 'night' : 'day');
  setNight(newMode);
};
```

---

## 5. SkyLayer Component — Broom Riders + Entities

Create `components/SkyLayer.tsx` as a fixed full-screen overlay with `pointer-events: none` on the container.

### 5.1 — Full Component

```tsx
// components/SkyLayer.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getOrGenerateAsset } from '@/lib/pixel-assets';
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
  const { isNight, house, addPoints, addGalleons, snitchLastCaught, setSnitchCaught } = useGameStore();
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [entities, setEntities] = useState<SkyEntity[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>();

  // Load assets for current theme
  useEffect(() => {
    const houseKey = house?.slice(0, 5) ?? 'gryff';
    const toLoad = [
      [`broom-${houseKey}-${isNight ? 'night' : 'day'}`, '...prompt...'],
      [`owl-${isNight ? 'night' : 'hedwig'}`, '...prompt...'],
      [`golden-snitch`, '...prompt...'],
      [`dementor`, '...prompt...'],
      [`dragon-silhouette`, '...prompt...'],
      [`niffler`, '...prompt...'],
      [`peeves`, '...prompt...'],
    ];
    Promise.all(toLoad.map(([key, prompt]) =>
      getOrGenerateAsset(key, prompt).then(src => ({ key, src }))
    )).then(results => {
      const map: Record<string, string> = {};
      results.forEach(({ key, src }) => { map[key] = src; });
      setAssets(map);
    });
  }, [isNight, house]);

  // ── Star Field Canvas (night only) ──────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isNight) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
    addPoints(150);
    addGalleons(25);
    playLevelUp();
    
    // Remove snitch entity
    setEntities(prev => prev.filter(e => e.type !== 'snitch'));
    
    // Show toast (use existing toast system)
    window.dispatchEvent(new CustomEvent('hogwarts:toast', {
      detail: { message: '⚡ You caught the Golden Snitch! +150 PTS +25🪙', type: 'legendary' }
    }));
  }, [snitchLastCaught]);

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

    addPoints(75);
    playExpectoPatronum(); // defined in Section 8

    // Remove dementor
    setEntities(prev => prev.filter(e => e.type !== 'dementor'));

    window.dispatchEvent(new CustomEvent('hogwarts:toast', {
      detail: { message: '✨ Expecto Patronum! Dementor banished! +75 PTS', type: 'epic' }
    }));
  }, [addPoints]);

  // ── Owl click handler ───────────────────────────────────────────────────────

  const handleOwlClick = useCallback(() => {
    addPoints(10);
    playOpen();
    window.dispatchEvent(new CustomEvent('hogwarts:toast', {
      detail: { message: '📜 Owl Post Received! +10 PTS', type: 'common' }
    }));
  }, [addPoints]);

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
      {isNight && <FloatingCandles asset={assets['floating-candles']} />}

      {/* Clouds (day only) */}
      {!isNight && <CloudLayer asset={assets['clouds-day']} />}

      {/* Sun / Moon indicator */}
      <CelestialBody
        isNight={isNight}
        sunAsset={assets['sun-pixel']}
        moonAsset={assets['moon-full']}
      />

      {/* Broom Riders */}
      {BROOM_CONFIGS.map((cfg, i) => {
        const houseKey = house?.slice(0, 5) ?? 'gryff';
        const assetKey = `broom-${houseKey}-${isNight ? 'night' : 'day'}`;
        return assets[assetKey] ? (
          <BroomRider
            key={i}
            config={cfg}
            src={assets[assetKey]}
            isNight={isNight}
          />
        ) : null;
      })}

      {/* Owls */}
      <OwlEntity
        src={assets[`owl-${isNight ? 'night' : 'hedwig'}`]}
        isNight={isNight}
        onClick={handleOwlClick}
      />

      {/* Golden Snitch (day only, after cooldown) */}
      {!isNight && assets['golden-snitch'] && (
        <SnitchEntity src={assets['golden-snitch']} onClick={handleSnitchClick} />
      )}

      {/* Dementor (night only, rare) */}
      {isNight && assets['dementor'] && (
        <DementorEntity src={assets['dementor']} onClick={handleDementorClick} />
      )}

      {/* Dragon (ultra-rare, both modes) */}
      {assets['dragon-silhouette'] && (
        <DragonEntity src={assets['dragon-silhouette']} isNight={isNight} />
      )}

      {/* Magic Particles */}
      <ParticleSystem isNight={isNight} />
    </div>
  );
}
```

### 5.2 — Sub-Components

```tsx
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

// ── SnitchEntity ──────────────────────────────────────────────────────────────

function SnitchEntity({ src, onClick }: { src: string; onClick: () => void }) {
  const [pos] = useState({
    top: `${Math.random() * 30 + 8}%`,
    left: `${Math.random() * 60 + 20}%`,
  });
  return (
    <img
      src={src}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        width: '16px',
        height: '16px',
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
      src={src}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '20%',
        left: '-60px',
        width: '32px',
        height: '48px',
        imageRendering: 'pixelated',
        pointerEvents: 'auto',
        cursor: 'crosshair',
        animation: 'dementorApproach 40s linear forwards',
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
    const check = () => { if (Math.random() < 0.02) setVisible(true); };
    const interval = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  if (!visible) return null;
  return (
    <img
      src={src}
      onAnimationEnd={() => setVisible(false)}
      style={{
        position: 'absolute',
        top: '5%',
        left: 0,
        width: '64px',
        height: '64px',
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

function FloatingCandles({ asset }: { asset?: string }) {
  if (!asset) return null;
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
            backgroundImage: `url(${asset})`,
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
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    char: chars[i % chars.length],
    left: `${Math.random() * 90 + 5}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${Math.random() * 6 + 6}s`,
    opacity: Math.random() * 0.4 + 0.1,
    size: Math.random() * 8 + 8,
  }));
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
```

### 5.3 — SkyLayer CSS Keyframes (add to `styles/pixel.css`)

```css
/* ── Broom Fly ── */
@keyframes broomFly {
  0%   { transform: translateX(-80px)  translateY(0px); }
  20%  { transform: translateX(20vw)   translateY(-14px); }
  40%  { transform: translateX(42vw)   translateY(8px); }
  60%  { transform: translateX(63vw)   translateY(-10px); }
  80%  { transform: translateX(85vw)   translateY(5px); }
  100% { transform: translateX(110vw)  translateY(-2px); }
}

/* ── Sprite Sheet Walker ── */
@keyframes spriteWalk {
  from { background-position-x: 0px; }
  to   { background-position-x: -128px; }
}

/* ── Snitch ── */
@keyframes snitchDrift {
  0%   { transform: translate(0px, 0px) rotate(0deg); }
  25%  { transform: translate(30px, -20px) rotate(15deg); }
  50%  { transform: translate(-20px, 15px) rotate(-10deg); }
  75%  { transform: translate(15px, 25px) rotate(8deg); }
  100% { transform: translate(0px, 0px) rotate(0deg); }
}
@keyframes snitchGlow {
  from { filter: drop-shadow(0 0 4px #FFD700) drop-shadow(0 0 8px rgba(255,215,0,0.5)); }
  to   { filter: drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px rgba(255,215,0,0.8)); }
}

/* ── Dementor ── */
@keyframes dementorApproach {
  0%   { transform: translateX(0px) translateY(0px) scale(0.6); opacity: 0; }
  5%   { opacity: 0.8; }
  100% { transform: translateX(60vw) translateY(40px) scale(1.3); opacity: 0.9; }
}

/* ── Dragon ── */
@keyframes dragonFly {
  0%   { transform: translateX(-100px) translateY(0px) scale(0.8); }
  50%  { transform: translateX(55vw) translateY(-30px) scale(1); }
  100% { transform: translateX(115vw) translateY(10px) scale(0.9); }
}

/* ── Floating Candles ── */
@keyframes candleFloat {
  from { transform: translateY(0px); }
  to   { transform: translateY(-8px); }
}

/* ── Particles ── */
@keyframes particleDrift {
  0%   { transform: translateY(0px) rotate(0deg);   opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 0.6; }
  100% { transform: translateY(-80vh) rotate(360deg); opacity: 0; }
}

/* ── Cloud Drift ── */
@keyframes cloudDrift {
  from { transform: translateX(-200px); }
  to   { transform: translateX(110vw); }
}
```

---

## 6. Living Environment Details

### 6.1 — Mouse Parallax (`components/MouseParallax.tsx`)

```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function MouseParallax({ children }: { children: React.ReactNode }) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      bgRef.current.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px) scale(1.06)`;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div ref={bgRef} style={{ transition: 'transform 0.15s ease-out', position: 'fixed', inset: '-3%', zIndex: -1 }}>
        {children}
      </div>
    </div>
  );
}
```

### 6.2 — Trunk Breathing (`styles/pixel.css`)

```css
/* Subtle idle animation on file trunks */
@keyframes trunkBreathe {
  0%, 100% { transform: translateY(0px);  filter: brightness(1) drop-shadow(2px 4px 0 #000); }
  50%       { transform: translateY(-3px); filter: brightness(1.06) drop-shadow(2px 6px 0 #000); }
}

.px-trunk:not(:hover) {
  animation: trunkBreathe 4s ease-in-out infinite;
}

/* Stagger each trunk by grid index */
.px-trunk:nth-child(1)  { animation-delay: 0.0s; }
.px-trunk:nth-child(2)  { animation-delay: 0.3s; }
.px-trunk:nth-child(3)  { animation-delay: 0.6s; }
.px-trunk:nth-child(4)  { animation-delay: 0.9s; }
.px-trunk:nth-child(5)  { animation-delay: 1.2s; }
.px-trunk:nth-child(6)  { animation-delay: 1.5s; }
.px-trunk:nth-child(7)  { animation-delay: 1.8s; }
.px-trunk:nth-child(8)  { animation-delay: 2.1s; }

/* Night shimmer on trunks */
[data-theme="night"] .px-trunk:hover {
  filter: brightness(1.1) drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
}
```

### 6.3 — Wall Torch Sprites (TopBar / Panels)

```tsx
// components/WallTorch.tsx
import { useGameStore } from '@/store/gameStore';
import { getOrGenerateAsset } from '@/lib/pixel-assets';
import { useEffect, useState } from 'react';

export default function WallTorch({ position = 'left' }: { position?: 'left' | 'right' }) {
  const { isNight } = useGameStore();
  const [src, setSrc] = useState('');

  useEffect(() => {
    getOrGenerateAsset('torch-wall', '...prompt...').then(setSrc);
  }, []);

  if (!isNight || !src) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        [position]: '-8px',
        transform: 'translateY(-50%)',
        width: '16px',
        height: '32px',
        backgroundImage: `url(${src})`,
        backgroundSize: '48px 64px',
        imageRendering: 'pixelated',
        animation: 'spriteWalk 0.45s steps(3) infinite',
        filter: 'drop-shadow(0 0 6px rgba(255, 160, 30, 0.8))',
      }}
    />
  );
}
```

### 6.4 — Fog Layer (bottom edge, night only)

```tsx
// components/FogLayer.tsx
export default function FogLayer({ isNight }: { isNight: boolean }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    getOrGenerateAsset('fog-overlay', '...prompt...').then(setSrc);
  }, []);
  if (!isNight || !src) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '120px',
      backgroundImage: `url(${src})`,
      backgroundSize: '400px 100px',
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'bottom',
      animation: 'fogDrift 20s linear infinite',
      opacity: 0.5,
      pointerEvents: 'none',
      zIndex: 2,
    }} />
  );
}

/* In pixel.css: */
/* @keyframes fogDrift { from { background-position-x: 0; } to { background-position-x: 400px; } } */
```

### 6.5 — Rain + Lightning System (random weather event)

```tsx
// components/WeatherSystem.tsx — triggers randomly every 15–30 minutes, lasts 3 minutes

export default function WeatherSystem({ isNight }: { isNight: boolean }) {
  const [raining, setRaining] = useState(false);
  const [lightning, setLightning] = useState(false);
  const [rainSrc, setRainSrc] = useState('');

  useEffect(() => {
    getOrGenerateAsset('rain-overlay', '...prompt...').then(setRainSrc);
    
    const scheduleRain = () => {
      const delay = (Math.random() * 15 + 15) * 60 * 1000;
      setTimeout(() => {
        setRaining(true);
        // Lightning flashes during rain
        const flashCount = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < flashCount; i++) {
          setTimeout(() => setLightning(true), i * 8000 + Math.random() * 4000);
          setTimeout(() => setLightning(false), i * 8000 + Math.random() * 4000 + 200);
        }
        setTimeout(() => { setRaining(false); scheduleRain(); }, 3 * 60 * 1000);
      }, delay);
    };
    scheduleRain();
  }, []);

  return (
    <>
      {raining && rainSrc && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
          backgroundImage: `url(${rainSrc})`,
          backgroundSize: '64px 64px',
          opacity: 0.35,
          animation: 'rainFall 0.4s steps(2) infinite',
        }} />
      )}
      {lightning && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: 'rgba(200, 220, 255, 0.15)',
          transition: 'opacity 0.05s',
        }} />
      )}
    </>
  );
}
/* In pixel.css: */
/* @keyframes rainFall { from { background-position: 0 0; } to { background-position: 64px 64px; } } */
```

---

## 7. Day↔Night Cinematic Transitions

### 7.1 — `lib/theme-transitions.ts`

```typescript
// lib/theme-transitions.ts
export async function triggerThemeTransition(goingNight: boolean): Promise<void> {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      transition: opacity 0.3s ease;
      opacity: 0;
      background: ${goingNight
        ? 'radial-gradient(ellipse at center, #1a1a40 0%, #0d0d22 100%)'
        : 'radial-gradient(ellipse at center, #FFE066 0%, #FFB74D 100%)'};
    `;
    document.body.appendChild(overlay);

    // Flash in
    requestAnimationFrame(() => {
      overlay.style.opacity = goingNight ? '0.55' : '0.40';
    });

    setTimeout(() => {
      // Fade out
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.remove(); resolve(); }, 350);
    }, 280);
  });
}
```

### 7.2 — Integration in TopBar

```tsx
// Updated toggle handler
const handleThemeToggle = async () => {
  const newMode = !isNight;
  await triggerThemeTransition(newMode);
  document.documentElement.setAttribute('data-theme', newMode ? 'night' : 'day');
  setNight(newMode);
  
  // Play audio
  if (newMode) playDusk(); else playDawn();
  
  // Award exploration points
  addPoints(5);

  // Lazy-load night assets without blocking
  if (newMode) preloadNightAssets();
};
```

---

## 8. New Audio Cues (extend `lib/pixel-audio.ts`)

```typescript
// Add these to lib/pixel-audio.ts

export function playDusk(): void {
  // Descending 5-note arpeggio: E4 → D4 → B3 → G3 → E3
  const ctx = getAudioContext();
  const notes = [329.63, 293.66, 246.94, 196.00, 164.81];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t); osc.stop(t + 0.38);
  });
}

export function playDawn(): void {
  // Ascending 5-note fanfare: E3 → G3 → B3 → D4 → E4
  const ctx = getAudioContext();
  const notes = [164.81, 196.00, 246.94, 293.66, 329.63];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.14;
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.start(t); osc.stop(t + 0.3);
  });
}

export function playExpectoPatronum(): void {
  // Shimmering ascending glissando + sustained chord
  const ctx = getAudioContext();
  for (let i = 0; i < 12; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 440 * Math.pow(2, i / 12); // chromatic scale up
    const t = ctx.currentTime + i * 0.05;
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.start(t); osc.stop(t + 0.55);
  }
}

export function playThunder(): void {
  // Low rumble via noise burst
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 0.8;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 180;
  const gain = ctx.createGain();
  gain.gain.value = 0.6;
  source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  source.start();
}

export function playSnitchCatch(): void {
  // Victorious rapid arpeggio + coin sound
  playLevelUp();
  setTimeout(playCoin, 300);
  setTimeout(playCoin, 550);
}
```

---

## 9. Zustand State Extensions

Add these fields to your existing game store:

```typescript
// In store/gameStore.ts — add to state interface:
interface GameState {
  // ...existing fields...
  isNight: boolean;
  setNight: (v: boolean) => void;

  snitchLastCaught: number | null;
  setSnitchCaught: (timestamp: number) => void;

  dementorActive: boolean;
  setDementorActive: (v: boolean) => void;

  weatherActive: boolean;
  dragonLastSeen: number | null;
  setDragonSeen: (timestamp: number) => void;

  nightFirstToggled: boolean;
  setNightFirstToggled: () => void;
}

// Zustand implementation additions:
isNight: false,
setNight: (v) => set({ isNight: v }),

snitchLastCaught: null,
setSnitchCaught: (ts) => set({ snitchLastCaught: ts }),

dementorActive: false,
setDementorActive: (v) => set({ dementorActive: v }),

weatherActive: false,
dragonLastSeen: null,
setDragonSeen: (ts) => set({ dragonLastSeen: ts }),

nightFirstToggled: false,
setNightFirstToggled: () => set({ nightFirstToggled: true }),
```

---

## 10. Acceptance Criteria

Before marking this feature complete, verify all of the following:

**Asset Generation**
- [ ] All 30+ Pixellab assets generate exactly once per browser, then serve from `localStorage` cache
- [ ] Cache version `v2` key is used — old `v1` caches are silently ignored
- [ ] Night assets only load when user first toggles to night mode (lazy)
- [ ] Sprite sheets render pixel-crisp (`image-rendering: pixelated` on all asset `<img>` tags)
- [ ] GIF assets loop seamlessly with no flicker

**Day/Night Toggle**
- [ ] Cinematic overlay flash plays on every toggle (no skip on rapid clicks)
- [ ] Full theme transition (CSS vars, background, panels) completes within 1.2s
- [ ] Star field canvas fades in/out over 1.0s, never pops
- [ ] Floating candles appear/disappear with theme, not abruptly
- [ ] Audio (`playDusk`/`playDawn`) only plays when audio is enabled in the store

**Sky Layer Entities**
- [ ] Broom riders never overlap the TopBar (enforce `top > 70px`)
- [ ] `SkyLayer` container is `pointer-events: none`; only entity `<img>` tags have `pointer-events: auto`
- [ ] Golden Snitch: cannot be clicked again within 3 minutes of last catch
- [ ] Dementor: only spawns in night mode, removed immediately on Patronum click
- [ ] Dragon: fires at most once per 5-minute window, 2% probability check
- [ ] Owl click: awards +10 PTS and plays `playOpen()` sound
- [ ] All entities removed cleanly when SkyLayer unmounts

**Living Details**
- [ ] Trunk breathing animation is staggered by index, not all trunks moving in sync
- [ ] Mouse parallax is capped so background never reveals its edges (scale ≥ 1.04)
- [ ] Fog layer only active in night mode
- [ ] Rain event: max 1 active at a time, auto-clears after 3 minutes
- [ ] Wall torches render only in night mode

**Audio**
- [ ] `playExpectoPatronum()`, `playDusk()`, `playDawn()`, `playThunder()` added to `pixel-audio.ts`
- [ ] All new audio respects the existing audio enabled/disabled toggle in Zustand

**Performance & Accessibility**
- [ ] `@media (prefers-reduced-motion: reduce)` disables all animations
- [ ] No layout shift during theme transition (no height/width changes)
- [ ] `requestAnimationFrame` loops in star canvas are cancelled on cleanup
- [ ] No memory leaks: event listeners and intervals cleaned up in `useEffect` returns
- [ ] All new Zustand state persisted to `localStorage` under the existing persistence key