// ═══════════════════════════════════════════════════════
// RARITY SYSTEM — File rarity based on type and size
// ═══════════════════════════════════════════════════════

import { getFileCategory, type FileCategory } from './file-utils';

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface RarityInfo {
  name: Rarity;
  cssClass: string;
  borderColor: string;
  label: string;
}

const RARITY_CONFIG: Record<Rarity, RarityInfo> = {
  COMMON: {
    name: 'COMMON',
    cssClass: 'rarity-common',
    borderColor: 'var(--pixel-gray)',
    label: 'COMMON',
  },
  UNCOMMON: {
    name: 'UNCOMMON',
    cssClass: 'rarity-uncommon',
    borderColor: 'var(--pixel-green)',
    label: 'UNCOMMON',
  },
  RARE: {
    name: 'RARE',
    cssClass: 'rarity-rare',
    borderColor: 'var(--pixel-blue)',
    label: 'RARE',
  },
  EPIC: {
    name: 'EPIC',
    cssClass: 'rarity-epic',
    borderColor: 'var(--pixel-purple)',
    label: 'EPIC',
  },
  LEGENDARY: {
    name: 'LEGENDARY',
    cssClass: 'rarity-legendary',
    borderColor: 'var(--pixel-yellow)',
    label: 'LEGENDARY',
  },
};

// File categories that bump rarity
const RARE_CATEGORIES: FileCategory[] = ['image', 'audio', 'code'];
const EPIC_CATEGORIES: FileCategory[] = ['video', 'archive'];

/**
 * Determine rarity based on mimeType and file size.
 */
export function getFileRarity(mimeType: string, sizeBytes?: string | number): Rarity {
  const category = getFileCategory(mimeType);
  const size = typeof sizeBytes === 'string' ? parseInt(sizeBytes, 10) : (sizeBytes || 0);

  // Files over 100MB are always LEGENDARY
  if (size > 100 * 1024 * 1024) return 'LEGENDARY';

  // EPIC categories (video, archives)
  if (EPIC_CATEGORIES.includes(category)) {
    return size > 50 * 1024 * 1024 ? 'LEGENDARY' : 'EPIC';
  }

  // RARE categories (images, audio, code)
  if (RARE_CATEGORIES.includes(category)) {
    if (size > 20 * 1024 * 1024) return 'EPIC';
    return 'RARE';
  }

  // PDF, document, spreadsheet, presentation
  if (['pdf', 'document', 'spreadsheet', 'presentation'].includes(category)) {
    if (size > 10 * 1024 * 1024) return 'RARE';
    return 'UNCOMMON';
  }

  // Text, unknown, etc.
  if (size > 10 * 1024 * 1024) return 'UNCOMMON';
  return 'COMMON';
}

/**
 * Get full rarity info object.
 */
export function getRarityInfo(mimeType: string, sizeBytes?: string | number): RarityInfo {
  const rarity = getFileRarity(mimeType, sizeBytes);
  return RARITY_CONFIG[rarity];
}

/**
 * Get the rarity badge colors for inline styling.
 */
export function getRarityBadgeColors(rarity: Rarity): { bg: string; text: string } {
  switch (rarity) {
    case 'COMMON':
      return { bg: '#B0BEC5', text: '#1a1a2e' };
    case 'UNCOMMON':
      return { bg: '#4CAF50', text: '#fff' };
    case 'RARE':
      return { bg: '#4FC3F7', text: '#1a1a2e' };
    case 'EPIC':
      return { bg: '#CE93D8', text: '#1a1a2e' };
    case 'LEGENDARY':
      return { bg: '#FFD700', text: '#1a1a2e' };
  }
}
