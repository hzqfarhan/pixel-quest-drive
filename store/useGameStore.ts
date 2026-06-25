// ═══════════════════════════════════════════════════════
// GAME STORE — Zustand with localStorage persistence
// ═══════════════════════════════════════════════════════
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type Achievement,
  type PlayerClass,
  getInitialAchievements,
  getRandomClass,
  xpForLevel,
  ACHIEVEMENT_DEFS,
} from '@/lib/gamification';

export interface Notification {
  id: string;
  message: string;
  xp?: number;
  coins?: number;
  type: 'xp' | 'achievement' | 'levelup' | 'info';
}

interface GameState {
  // Player
  playerName: string;
  playerClass: PlayerClass;
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  coins: number;
  totalCoinsEarned: number;

  // Stats
  filesViewed: number;
  filesDownloaded: number;
  pdfsViewed: number;
  mediaPlayed: number;
  searchesUsed: number;
  foldersExplored: string[];
  totalFolders: number;
  sessionStartTime: number;
  firstFileTime: number | null;
  viewedFileIds: string[];
  largestFileId: string | null;

  // Achievements
  achievements: Achievement[];
  pendingAchievements: Achievement[];

  // Notifications
  notifications: Notification[];

  // Flags
  initialized: boolean;
  showLevelUp: boolean;
  newLevel: number;

  // Actions
  initialize: () => void;
  gainXP: (amount: number, coins?: number, message?: string) => void;
  spendMP: (amount: number) => boolean;
  restoreMP: (amount: number) => void;
  recordFileView: (fileId: string) => void;
  recordDownload: () => void;
  recordPdfView: () => void;
  recordMediaPlay: () => void;
  recordSearch: () => void;
  recordFolderExplore: (folderId: string) => void;
  setTotalFolders: (count: number) => void;
  setLargestFileId: (id: string) => void;
  checkAchievements: () => void;
  dismissAchievement: () => void;
  addNotification: (notif: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  dismissLevelUp: () => void;
  setPlayerName: (name: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      playerName: 'ADVENTURER',
      playerClass: 'WARRIOR',
      level: 1,
      totalXP: 0,
      currentXP: 0,
      xpToNext: xpForLevel(1),
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      coins: 0,
      totalCoinsEarned: 0,
      filesViewed: 0,
      filesDownloaded: 0,
      pdfsViewed: 0,
      mediaPlayed: 0,
      searchesUsed: 0,
      foldersExplored: [],
      totalFolders: 0,
      sessionStartTime: Date.now(),
      firstFileTime: null,
      viewedFileIds: [],
      largestFileId: null,
      achievements: getInitialAchievements(),
      pendingAchievements: [],
      notifications: [],
      initialized: false,
      showLevelUp: false,
      newLevel: 1,

      initialize: () => {
        const state = get();
        if (!state.initialized) {
          set({
            initialized: true,
            playerClass: getRandomClass(),
            sessionStartTime: Date.now(),
          });
        } else {
          set({ sessionStartTime: Date.now() });
        }
      },

      gainXP: (amount: number, coinReward: number = 0, message?: string) => {
        const state = get();
        let newTotalXP = state.totalXP + amount;
        let newCurrentXP = state.currentXP + amount;
        let newLevel = state.level;
        let newXpToNext = state.xpToNext;
        let leveledUp = false;
        const newCoins = state.coins + coinReward;
        const newTotalCoins = state.totalCoinsEarned + coinReward;

        // Check for level ups
        while (newCurrentXP >= newXpToNext && newLevel < 50) {
          newCurrentXP -= newXpToNext;
          newLevel++;
          newXpToNext = xpForLevel(newLevel);
          leveledUp = true;
        }

        const updates: Partial<GameState> = {
          totalXP: newTotalXP,
          currentXP: newCurrentXP,
          xpToNext: newXpToNext,
          level: newLevel,
          coins: newCoins,
          totalCoinsEarned: newTotalCoins,
        };

        if (leveledUp) {
          updates.showLevelUp = true;
          updates.newLevel = newLevel;
          updates.hp = state.maxHp; // Full HP restore on level up
          // Gold bonus: +level × 5
          updates.coins = newCoins + newLevel * 5;
          updates.totalCoinsEarned = newTotalCoins + newLevel * 5;
        }

        set(updates);

        if (message) {
          get().addNotification({ message, xp: amount, coins: coinReward, type: 'xp' });
        }

        // Check achievements after XP gain
        setTimeout(() => get().checkAchievements(), 100);
      },

      spendMP: (amount: number) => {
        const state = get();
        if (state.mp < amount) return false;
        set({ mp: state.mp - amount });
        return true;
      },

      restoreMP: (amount: number) => {
        const state = get();
        set({ mp: Math.min(state.maxMp, state.mp + amount) });
      },

      recordFileView: (fileId: string) => {
        const state = get();
        if (!state.firstFileTime) {
          set({ firstFileTime: Date.now() });
        }
        if (!state.viewedFileIds.includes(fileId)) {
          set({
            filesViewed: state.filesViewed + 1,
            viewedFileIds: [...state.viewedFileIds, fileId],
          });
        }
      },

      recordDownload: () => {
        set((s) => ({ filesDownloaded: s.filesDownloaded + 1 }));
      },

      recordPdfView: () => {
        set((s) => ({ pdfsViewed: s.pdfsViewed + 1 }));
      },

      recordMediaPlay: () => {
        set((s) => ({ mediaPlayed: s.mediaPlayed + 1 }));
      },

      recordSearch: () => {
        set((s) => ({ searchesUsed: s.searchesUsed + 1 }));
      },

      recordFolderExplore: (folderId: string) => {
        const state = get();
        if (!state.foldersExplored.includes(folderId)) {
          set({
            foldersExplored: [...state.foldersExplored, folderId],
          });
        }
      },

      setTotalFolders: (count: number) => {
        set({ totalFolders: count });
      },

      setLargestFileId: (id: string) => {
        set({ largestFileId: id });
      },

      checkAchievements: () => {
        const state = get();
        const now = Date.now();
        const newAchievements = [...state.achievements];
        const pending: Achievement[] = [];

        for (const ach of newAchievements) {
          if (ach.unlocked) continue;

          let shouldUnlock = false;

          switch (ach.id) {
            case 'first_blood':
              shouldUnlock = state.filesViewed >= 1;
              break;
            case 'treasure_hunter':
              shouldUnlock = state.filesDownloaded >= 5;
              break;
            case 'speed_runner':
              if (state.firstFileTime && state.filesViewed >= 10) {
                shouldUnlock = now - state.firstFileTime < 5 * 60 * 1000;
              }
              break;
            case 'completionist':
              shouldUnlock =
                state.totalFolders > 0 &&
                state.foldersExplored.length >= state.totalFolders;
              break;
            case 'media_master':
              shouldUnlock = state.mediaPlayed >= 3;
              break;
            case 'scroll_keeper':
              shouldUnlock = state.pdfsViewed >= 5;
              break;
            case 'mage_path':
              shouldUnlock = state.searchesUsed >= 10;
              break;
            case 'gold_hoarder':
              shouldUnlock = state.totalCoinsEarned >= 500;
              break;
            case 'speed_loader':
              // Checked externally when PWA is installed
              break;
            case 'lore_master':
              shouldUnlock = state.filesViewed >= 50;
              break;
            case 'dungeon_boss':
              // Checked externally when largest file is downloaded
              break;
            case 'night_owl': {
              const hour = new Date().getHours();
              shouldUnlock = hour >= 23 || hour < 5;
              break;
            }
            case 'wanderer':
              shouldUnlock = now - state.sessionStartTime > 30 * 60 * 1000;
              break;
          }

          if (shouldUnlock) {
            ach.unlocked = true;
            ach.unlockedAt = now;
            pending.push(ach);
          }
        }

        if (pending.length > 0) {
          set({
            achievements: newAchievements,
            pendingAchievements: [...state.pendingAchievements, ...pending],
          });

          // Grant achievement XP/coins
          for (const ach of pending) {
            const def = ACHIEVEMENT_DEFS.find((d) => d.id === ach.id);
            if (def) {
              // Delay slightly to avoid recursive update
              setTimeout(() => {
                get().gainXP(def.xpReward, def.coinReward);
              }, 200);
            }
          }
        }
      },

      dismissAchievement: () => {
        set((s) => ({
          pendingAchievements: s.pendingAchievements.slice(1),
        }));
      },

      addNotification: (notif) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set((s) => ({
          notifications: [...s.notifications, { ...notif, id }].slice(-5),
        }));
        // Auto-remove after 2s
        setTimeout(() => {
          get().removeNotification(id);
        }, 2000);
      },

      removeNotification: (id) => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        }));
      },

      dismissLevelUp: () => {
        set({ showLevelUp: false });
      },

      setPlayerName: (name: string) => {
        set({ playerName: name || 'ADVENTURER' });
      },
    }),
    {
      name: 'pixel-quest-drive-store',
      partialize: (state) => ({
        playerName: state.playerName,
        playerClass: state.playerClass,
        level: state.level,
        totalXP: state.totalXP,
        currentXP: state.currentXP,
        xpToNext: state.xpToNext,
        hp: state.hp,
        maxHp: state.maxHp,
        mp: state.mp,
        maxMp: state.maxMp,
        coins: state.coins,
        totalCoinsEarned: state.totalCoinsEarned,
        filesViewed: state.filesViewed,
        filesDownloaded: state.filesDownloaded,
        pdfsViewed: state.pdfsViewed,
        mediaPlayed: state.mediaPlayed,
        searchesUsed: state.searchesUsed,
        foldersExplored: state.foldersExplored,
        totalFolders: state.totalFolders,
        viewedFileIds: state.viewedFileIds,
        achievements: state.achievements,
        initialized: state.initialized,
      }),
    }
  )
);
