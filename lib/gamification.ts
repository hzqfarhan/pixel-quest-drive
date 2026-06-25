// ═══════════════════════════════════════════════════════
// GAMIFICATION ENGINE — XP, leveling, achievements
// ═══════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  unlockedAt?: number;
}

// ── XP Rewards ──
export const XP_REWARDS = {
  FIRST_VISIT: { xp: 50, coins: 5, message: 'ADVENTURE BEGINS!' },
  OPEN_FOLDER: { xp: 25, coins: 3, message: 'DUNGEON ENTERED!' },
  VIEW_FILE: { xp: 30, coins: 2, message: 'FILE INSPECTED!' },
  VIEW_IMAGE: { xp: 20, coins: 2, message: 'ARTIFACT DISCOVERED!' },
  PLAY_VIDEO: { xp: 40, coins: 5, message: 'CUTSCENE UNLOCKED!' },
  PLAY_AUDIO: { xp: 35, coins: 3, message: 'BARD SONG LEARNED!' },
  DOWNLOAD_FILE: { xp: 50, coins: 10, message: 'ITEM ACQUIRED!' },
  DOWNLOAD_ZIP: { xp: 100, coins: 25, message: 'TREASURE LOOTED!' },
  VIEW_PDF: { xp: 45, coins: 3, message: 'ANCIENT SCROLL READ!' },
  SEARCH_FOUND: { xp: 60, coins: 5, message: 'RARE ITEM FOUND!' },
  FOLDER_CLEARED: { xp: 200, coins: 50, message: 'DUNGEON CLEARED!' },
  INSTALL_PWA: { xp: 500, coins: 100, message: 'PORTAL CREATED!' },
  FIVE_MINUTES: { xp: 150, coins: 20, message: 'SEASONED EXPLORER!' },
} as const;

// ── Leveling Formula ──
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.4, level - 1));
}

export function getLevelFromTotalXP(totalXP: number): { level: number; currentXP: number; xpToNext: number } {
  let level = 1;
  let xpRemaining = totalXP;

  while (true) {
    const needed = xpForLevel(level);
    if (xpRemaining < needed) {
      return { level, currentXP: xpRemaining, xpToNext: needed };
    }
    xpRemaining -= needed;
    level++;
    if (level > 50) {
      return { level: 50, currentXP: xpRemaining, xpToNext: xpForLevel(50) };
    }
  }
}

// ── Rank Titles ──
export function getRankTitle(level: number): string {
  if (level <= 3) return 'NEWBIE SQUIRE';
  if (level <= 6) return 'FILE SEEKER';
  if (level <= 10) return 'DUNGEON CRAWLER';
  if (level <= 15) return 'VAULT GUARDIAN';
  if (level <= 20) return 'ARCHIVE KNIGHT';
  if (level <= 30) return 'LORE MASTER';
  if (level <= 40) return 'LEGENDARY MAGE';
  return 'PIXEL GOD';
}

// ── Player Classes ──
export const PLAYER_CLASSES = ['WARRIOR', 'MAGE', 'ROGUE', 'BARD'] as const;
export type PlayerClass = typeof PLAYER_CLASSES[number];

export function getRandomClass(): PlayerClass {
  return PLAYER_CLASSES[Math.floor(Math.random() * PLAYER_CLASSES.length)];
}

export function getClassColor(cls: PlayerClass): string {
  switch (cls) {
    case 'WARRIOR': return 'var(--pixel-red)';
    case 'MAGE': return 'var(--pixel-purple)';
    case 'ROGUE': return 'var(--pixel-green)';
    case 'BARD': return 'var(--pixel-yellow)';
  }
}

// ── Achievement Definitions ──
export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_blood',
    name: 'FIRST BLOOD',
    description: 'View your first file',
    emoji: '🗡️',
    xpReward: 100,
    coinReward: 20,
  },
  {
    id: 'treasure_hunter',
    name: 'TREASURE HUNTER',
    description: 'Download 5 files',
    emoji: '💰',
    xpReward: 250,
    coinReward: 50,
  },
  {
    id: 'speed_runner',
    name: 'SPEED RUNNER',
    description: 'View 10 files in under 5 minutes',
    emoji: '⚡',
    xpReward: 300,
    coinReward: 40,
  },
  {
    id: 'completionist',
    name: 'COMPLETIONIST',
    description: 'Open every folder',
    emoji: '🏆',
    xpReward: 500,
    coinReward: 100,
  },
  {
    id: 'media_master',
    name: 'MEDIA MASTER',
    description: 'Play 3 videos or audio files',
    emoji: '🎬',
    xpReward: 200,
    coinReward: 30,
  },
  {
    id: 'scroll_keeper',
    name: 'SCROLL KEEPER',
    description: 'Read 5 PDFs',
    emoji: '📜',
    xpReward: 200,
    coinReward: 30,
  },
  {
    id: 'mage_path',
    name: 'MAGE PATH',
    description: 'Use search 10 times',
    emoji: '🔮',
    xpReward: 150,
    coinReward: 25,
  },
  {
    id: 'gold_hoarder',
    name: 'GOLD HOARDER',
    description: 'Earn 500 gold total',
    emoji: '🪙',
    xpReward: 300,
    coinReward: 100,
  },
  {
    id: 'speed_loader',
    name: 'SPEED LOADER',
    description: 'Install as PWA',
    emoji: '📲',
    xpReward: 500,
    coinReward: 50,
  },
  {
    id: 'lore_master',
    name: 'LORE MASTER',
    description: 'View 50+ files',
    emoji: '📚',
    xpReward: 750,
    coinReward: 150,
  },
  {
    id: 'dungeon_boss',
    name: 'DUNGEON BOSS',
    description: 'Download the largest file',
    emoji: '🐉',
    xpReward: 400,
    coinReward: 80,
  },
  {
    id: 'night_owl',
    name: 'NIGHT OWL',
    description: 'Visit after 11pm',
    emoji: '🦉',
    xpReward: 100,
    coinReward: 15,
  },
  {
    id: 'wanderer',
    name: 'WANDERER',
    description: 'Spend 30 minutes exploring',
    emoji: '🧭',
    xpReward: 500,
    coinReward: 100,
  },
];

export function getInitialAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    unlocked: false,
  }));
}
