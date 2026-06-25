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
  FIRST_VISIT: { xp: 50, coins: 5, message: 'HOGWARTS LETTER RECEIVED!' },
  OPEN_FOLDER: { xp: 25, coins: 3, message: 'VAULT ENTERED!' },
  VIEW_FILE: { xp: 30, coins: 2, message: 'RELIC INSPECTED!' },
  VIEW_IMAGE: { xp: 20, coins: 2, message: 'PORTRAIT DISCOVERED!' },
  PLAY_VIDEO: { xp: 40, coins: 5, message: 'PENSIEVE MEMORY UNLOCKED!' },
  PLAY_AUDIO: { xp: 35, coins: 3, message: 'MAGICAL TUNE LEARNED!' },
  DOWNLOAD_FILE: { xp: 50, coins: 10, message: 'ITEM ACQUIRED!' },
  DOWNLOAD_ZIP: { xp: 100, coins: 25, message: 'TRUNK LOOTED!' },
  VIEW_PDF: { xp: 45, coins: 3, message: 'ANCIENT SCROLL READ!' },
  SEARCH_FOUND: { xp: 60, coins: 5, message: 'ACCIO SUCCESSFUL!' },
  FOLDER_CLEARED: { xp: 200, coins: 50, message: 'VAULT CLEARED!' },
  INSTALL_PWA: { xp: 500, coins: 100, message: 'PORTKEY CREATED!' },
  FIVE_MINUTES: { xp: 150, coins: 20, message: 'SEASONED WIZARD!' },
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
  if (level <= 3) return 'FIRST YEAR';
  if (level <= 6) return 'STUDENT WIZARD';
  if (level <= 10) return 'PREFECT';
  if (level <= 15) return 'HEAD BOY/GIRL';
  if (level <= 20) return 'AUROR';
  if (level <= 30) return 'PROFESSOR';
  if (level <= 40) return 'HEADMASTER';
  return 'ORDER OF MERLIN';
}

// ── Player Classes ──
export const PLAYER_CLASSES = ['GRYFFINDOR', 'RAVENCLAW', 'SLYTHERIN', 'HUFFLEPUFF'] as const;
export type PlayerClass = typeof PLAYER_CLASSES[number];

export function getRandomClass(): PlayerClass {
  return PLAYER_CLASSES[Math.floor(Math.random() * PLAYER_CLASSES.length)];
}

export function getClassColor(cls: PlayerClass): string {
  switch (cls) {
    case 'GRYFFINDOR': return 'var(--pixel-red)';
    case 'RAVENCLAW': return 'var(--pixel-blue)';
    case 'SLYTHERIN': return 'var(--pixel-green)';
    case 'HUFFLEPUFF': return 'var(--pixel-yellow)';
  }
}

// ── Achievement Definitions ──
export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_blood',
    name: 'WAND CHOSEN',
    description: 'View your first file',
    emoji: '🪄',
    xpReward: 100,
    coinReward: 20,
  },
  {
    id: 'treasure_hunter',
    name: 'NIFFLER',
    description: 'Download 5 files',
    emoji: '💰',
    xpReward: 250,
    coinReward: 50,
  },
  {
    id: 'speed_runner',
    name: 'FIREBOLT FLYER',
    description: 'View 10 files in under 5 minutes',
    emoji: '🧹',
    xpReward: 300,
    coinReward: 40,
  },
  {
    id: 'completionist',
    name: 'MARAUDER',
    description: 'Open every folder',
    emoji: '📜',
    xpReward: 500,
    coinReward: 100,
  },
  {
    id: 'media_master',
    name: 'PENSIEVE DIVER',
    description: 'Play 3 videos or audio files',
    emoji: '🎬',
    xpReward: 200,
    coinReward: 30,
  },
  {
    id: 'scroll_keeper',
    name: 'HERMIONE\'S PRIDE',
    description: 'Read 5 PDFs',
    emoji: '📚',
    xpReward: 200,
    coinReward: 30,
  },
  {
    id: 'mage_path',
    name: 'SEEKER',
    description: 'Use search 10 times',
    emoji: '🔮',
    xpReward: 150,
    coinReward: 25,
  },
  {
    id: 'gold_hoarder',
    name: 'GRINGOTTS GOBLIN',
    description: 'Earn 500 galleons total',
    emoji: '🪙',
    xpReward: 300,
    coinReward: 100,
  },
  {
    id: 'speed_loader',
    name: 'PORTKEY EXPERT',
    description: 'Install as PWA',
    emoji: '📲',
    xpReward: 500,
    coinReward: 50,
  },
  {
    id: 'lore_master',
    name: 'HISTORY OF MAGIC',
    description: 'View 50+ files',
    emoji: '🦉',
    xpReward: 750,
    coinReward: 150,
  },
  {
    id: 'dungeon_boss',
    name: 'DRAGON TAMER',
    description: 'Download the largest file',
    emoji: '🐉',
    xpReward: 400,
    coinReward: 80,
  },
  {
    id: 'night_owl',
    name: 'ASTRONOMY TOWER',
    description: 'Visit after 11pm',
    emoji: '🔭',
    xpReward: 100,
    coinReward: 15,
  },
  {
    id: 'wanderer',
    name: 'FORBIDDEN FOREST',
    description: 'Spend 30 minutes exploring',
    emoji: '🌲',
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
