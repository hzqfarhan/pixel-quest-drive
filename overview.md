# 🏰 HOGWARTS DRIVE — System Overview

This document provides a comprehensive overview of the design system, assets, user flow, animations, and architecture of **Hogwarts Drive** (formerly Pixel Quest Drive).

---

## 🎨 1. Color Palette (16-bit Retro RPG)

The application uses a strict custom pixel-art color palette defined in `styles/pixel.css`. No component libraries (like Tailwind's default palette) are used for core theming.

- **Primary Colors**:
  - `--pixel-white`: `#FFFFF0` (Off-white / Parchment)
  - `--pixel-black`: `#1a1a2e` (Deep Navy / Outlines)
  - `--pixel-yellow`: `#FFD700` (Gold / Galleons / Primary Accents)
  - `--pixel-bg`: `#FFFFF0` (Base background fallback)
  - `--pixel-panel`: `#FFF8E7` (UI Panels and Cards)
  - `--pixel-shadow`: `#000000` (Hard drop shadows)

- **House & Magical Accents**:
  - `--pixel-red`: `#FF5252` (Gryffindor / HP Bar)
  - `--pixel-blue`: `#4FC3F7` (Ravenclaw / Mana Bar / Folders)
  - `--pixel-green`: `#4CAF50` (Slytherin)
  - `--pixel-yellow`: `#FFD700` (Hufflepuff)
  - `--pixel-purple`: `#CE93D8` (Epic Rarity / Spells)
  - `--pixel-gray`: `#B0BEC5` (Common Rarity / Disabled text)
  - `--pixel-orange`: `#FFB74D` (Legendary Rarity alternative)

---

## 📦 2. Assets & Resources

### Pixellab AI Generated Images (`/public/assets/hp/`)
These images are dynamically generated via the Pixellab API to replace standard UI components with immersive Harry Potter pixel art.

- **Character Sprites (32x32)**:
  - `gryffindor.png`: Used in the TopBar and loading screens to represent players who are sorted into Gryffindor.
  - `ravenclaw.png`: Used in the TopBar and loading screens to represent players who are sorted into Ravenclaw.
  - `slytherin.png`: Used in the TopBar and loading screens to represent players who are sorted into Slytherin.
  - `hufflepuff.png`: Used in the TopBar and loading screens to represent players who are sorted into Hufflepuff.

- **UI Elements**:
  - `sorting-hat.png`: Appears during the cinematic boot sequence (Phase 1). It acts as the "randomizer" that decides the player's starting House (class).
  - `hogwarts-trunk.png`: Replaces the generic folder SVG icons in the `FileGrid`. Each directory in Google Drive is visually represented as a magical trunk that pops open upon hover.
  - `galleon.png`: The currency icon used in the `TopBar` and `AchievementToast` popups. Replaces standard gold coins. It spins when the player earns money.

- **Backgrounds (400x225 - CSS Covered)**:
  - `hogwarts-day.png`: The default bright, sunny landscape of Hogwarts Castle that covers the entire application background behind the main UI panels.
  - `hogwarts-night.png`: A dark, starry variation of the Hogwarts Castle landscape. It is triggered when the player clicks the 🌙 button on the navbar, seamlessly fading in to replace the day background.

### Audio Synthesizer (`lib/pixel-audio.ts`)
Instead of static `.mp3` files, the app uses the **Web Audio API** to dynamically synthesize 8-bit retro sound effects:
- **playXPGain()**: High-pitched rapid arpeggio
- **playCoin()**: Classic retro coin ping
- **playLevelUp()**: Victorious 8-bit fanfare
- **playOpen()**: Low-pitch thud (opening trunk)
- **playDownload()**: Satisfying sliding tone

---

## 🧭 3. User Flow & Progression

1. **Cinematic Intro**: 
   - A black screen types out `HOGWARTS DRIVE ▮`.
   - The Sorting Hat dynamically assigns the user to one of the 4 magical houses.
   - The UI slides in, and the user receives "FIRST VISIT" points (PTS).
2. **Exploration**:
   - Users explore the Google Drive structure (Vaults).
   - They click on Trunks to navigate deeper.
   - They click on Files (Relics) to inspect them in a preview modal.
   - Downloading files grants the largest PTS rewards.
3. **Progression**:
   - Actions earn **PTS** (XP) and **Galleons** (Gold).
   - Earning enough PTS triggers a **Level Up**, fully restoring HP and giving a Galleon bonus.
   - Ranks change automatically based on level (e.g., First Year, Prefect, Auror, Order of Merlin).
4. **Achievements**:
   - The game continuously checks milestones in the background.
   - Unlocking an achievement (e.g., "Niffler" for downloading 5 files) shows a toast notification and grants bonus PTS.

---

## ✨ 4. Animations & Micro-Interactions

Defined in `styles/pixel.css` to create a "living" 8-bit environment:

- **`animate-coin-spin`**: 3D spinning illusion for Galleons.
- **`animate-walk`**: Subtle bobbing for character sprites.
- **`animate-shimmer`**: Glowing box-shadow pulse for Epic/Legendary files.
- **`px-chest-open`**: 3D rotation of the trunk lid on hover.
- **`px-xp-pop`**: Floating text that fades out as it moves upward (+50 PTS).
- **`progress-stripe`**: Continuous scrolling diagonal lines on the loading bar.
- **`px-pulse-glow`**: Heartbeat pulse on the Level badge when close to leveling up.
- **`stagger-in`**: UI panels dropping in smoothly on load.

---

## 🕹️ 5. HUD / Navbar (TopBar)

The `TopBar.tsx` component is the main dashboard header, containing:

- **Left Side**: 
  - `HOGWARTS DRIVE` logo with blinking cursor.
  - Player Sprite (reflects assigned house).
  - Player Name (WIZARD) and House.
  - Level Badge (pulses when close to level-up).
- **Center Bars**: 
  - ❤️ **HP**: Health Points (Restores on Level up).
  - ⭐ **PTS**: Experience Points (Fills up towards the next level).
  - 🔵 **MANA**: Magic points (Consumed by casting spells).
- **Right Side**:
  - **Galleon Counter**: Spins and increments when picking up loot.
  - **Playtime Timer**: Tracks the active session.
  - **Day/Night Toggle (☀️/🌙)**: Instantly swaps the main background between `hogwarts-day.png` and `hogwarts-night.png`.
  - **Revelio Spell (🔮)**: Opens the search modal (Costs 5 MANA to cast).
  - **Audio Toggle (🔊/🔇)**: Enables or disables the Web Audio synthesizer.

---

## 🏗️ 6. Core Architecture

- **Framework**: Next.js 14+ (App Router).
- **State Management**: Zustand with `localStorage` persistence (user state survives refreshes).
- **Drive API**: Serverless API routes (`/api/drive/files`, `/api/drive/download`) authenticating with a Google Service Account using googleapis.
- **PWA**: Configured with `next-pwa`, allowing users to "Install" the Hogwarts Drive as a standalone desktop/mobile app (with an achievement tied to it).
