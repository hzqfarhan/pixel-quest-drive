'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { type DriveFile } from '@/lib/google-drive';
import { getFileCategory } from '@/lib/file-utils';
import { XP_REWARDS } from '@/lib/gamification';
import { useGameStore } from '@/store/useGameStore';
import {
  playXPGain,
  playCoin,
  playLevelUp,
  playOpen,
  playDownload,
  playFileOpen,
} from '@/lib/pixel-audio';
import TopBar from '@/components/HUD/TopBar';
import Sidebar from '@/components/Layout/Sidebar';
import FileGrid from '@/components/FileGrid/FileGrid';
import FilePreviewModal from '@/components/Modals/FilePreviewModal';
import AchievementToast from '@/components/Modals/AchievementToast';
import SearchSpellModal from '@/components/Modals/SearchSpellModal';
import PixelSprite from '@/components/Pixel/PixelSprite';
import PixelNotification from '@/components/Pixel/PixelNotification';

const ROOT_FOLDER_ID = process.env.NEXT_PUBLIC_ROOT_FOLDER_ID || '';

interface FolderItem {
  id: string;
  name: string;
  depth: number;
}

export default function HomePage() {
  // Game store
  const {
    initialize,
    gainXP,
    spendMP,
    recordFileView,
    recordDownload,
    recordPdfView,
    recordMediaPlay,
    recordSearch,
    recordFolderExplore,
    setTotalFolders,
    showLevelUp,
    newLevel,
    dismissLevelUp,
    playerClass,
    notifications,
    checkAchievements,
  } = useGameStore();

  // UI state
  const [introPhase, setIntroPhase] = useState(0); // 0=typing, 1=class, 2=hud, 3=loading, 4=ready
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [allFilesFlat, setAllFilesFlat] = useState<(DriveFile & { parentFolderId?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [currentFolderId, setCurrentFolderId] = useState(ROOT_FOLDER_ID);
  const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([
    { id: ROOT_FOLDER_ID, name: 'ROOT DUNGEON' },
  ]);
  const [folderTree, setFolderTree] = useState<FolderItem[]>([]);
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typedTitle, setTypedTitle] = useState('');
  const initialized = useRef(false);

  const fullTitle = 'PIXEL QUEST DRIVE';

  // ── CINEMATIC INTRO ──
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initialize();

    // Phase 0: Type out title
    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setTypedTitle(fullTitle.slice(0, i));
      if (i >= fullTitle.length) {
        clearInterval(typeInterval);
        setTimeout(() => setIntroPhase(1), 400); // Show class
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [initialize]);

  useEffect(() => {
    if (introPhase === 1) {
      setTimeout(() => setIntroPhase(2), 1000); // Show HUD
    }
    if (introPhase === 2) {
      // Give first visit XP
      const r = XP_REWARDS.FIRST_VISIT;
      gainXP(r.xp, r.coins, r.message);
      playXPGain();
      setTimeout(() => setIntroPhase(3), 800); // Start loading
    }
    if (introPhase === 3) {
      fetchFolder(ROOT_FOLDER_ID);
      fetchFolderTree(ROOT_FOLDER_ID, 0);
    }
  }, [introPhase]);

  // ── Level-up effect ──
  useEffect(() => {
    if (showLevelUp) {
      playLevelUp();
      const t = setTimeout(dismissLevelUp, 3000);
      return () => clearTimeout(t);
    }
  }, [showLevelUp, dismissLevelUp]);

  // ── Periodic achievement checks ──
  useEffect(() => {
    const interval = setInterval(checkAchievements, 30000);
    return () => clearInterval(interval);
  }, [checkAchievements]);

  // ── FETCH FOLDER ──
  const fetchFolder = useCallback(async (folderId: string) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`/api/drive/files?folderId=${folderId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load');
      }

      setFiles(data.files || []);

      // Count folders for completionist
      const folderCount = (data.files || []).filter(
        (f: DriveFile) => f.mimeType === 'application/vnd.google-apps.folder'
      ).length;
      if (folderId === ROOT_FOLDER_ID) {
        setTotalFolders(folderCount);
      }

      setIntroPhase(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIntroPhase(4);
    } finally {
      setLoading(false);
    }
  }, [setTotalFolders]);

  // ── BUILD FOLDER TREE (recursive) ──
  const fetchFolderTree = useCallback(
    async (folderId: string, depth: number) => {
      try {
        const res = await fetch(`/api/drive/files?folderId=${folderId}`);
        const data = await res.json();
        if (!res.ok) return;

        const folders = (data.files || []).filter(
          (f: DriveFile) => f.mimeType === 'application/vnd.google-apps.folder'
        );

        const nonFolders = (data.files || []).filter(
          (f: DriveFile) => f.mimeType !== 'application/vnd.google-apps.folder'
        );

        // Store all files flat for search
        setAllFilesFlat((prev) => [
          ...prev,
          ...nonFolders.map((f: DriveFile) => ({ ...f, parentFolderId: folderId })),
        ]);

        const items: FolderItem[] = folders.map((f: DriveFile) => ({
          id: f.id,
          name: f.name,
          depth,
        }));

        setFolderTree((prev) => {
          const existing = new Set(prev.map((p) => p.id));
          const newItems = items.filter((item: FolderItem) => !existing.has(item.id));
          return [...prev, ...newItems];
        });

        // Recurse into subfolders (limited depth)
        if (depth < 3) {
          for (const folder of folders) {
            await fetchFolderTree(folder.id, depth + 1);
          }
        }
      } catch {
        // Silently fail for tree building
      }
    },
    []
  );

  // ── FOLDER NAVIGATION ──
  const navigateToFolder = useCallback(
    (folder: DriveFile | { id: string; name: string }) => {
      const r = XP_REWARDS.OPEN_FOLDER;
      gainXP(r.xp, r.coins, r.message);
      playOpen();
      recordFolderExplore(folder.id);

      setCurrentFolderId(folder.id);

      // Check if it's already in the stack
      const existingIndex = folderStack.findIndex((f) => f.id === folder.id);
      if (existingIndex >= 0) {
        setFolderStack(folderStack.slice(0, existingIndex + 1));
      } else {
        setFolderStack([
          ...folderStack,
          { id: folder.id, name: 'name' in folder ? folder.name : folder.id },
        ]);
      }

      fetchFolder(folder.id);
    },
    [gainXP, recordFolderExplore, folderStack, fetchFolder]
  );

  const navigateToFolderById = useCallback(
    (folderId: string) => {
      const treeItem = folderTree.find((f) => f.id === folderId);
      navigateToFolder({
        id: folderId,
        name: treeItem?.name || 'DUNGEON',
      });
    },
    [folderTree, navigateToFolder]
  );

  // ── FILE PREVIEW ──
  const handleFilePreview = useCallback(
    (file: DriveFile) => {
      setPreviewFile(file);
      recordFileView(file.id);
      playFileOpen();

      const category = getFileCategory(file.mimeType);
      let reward = XP_REWARDS.VIEW_FILE;
      if (category === 'image') reward = XP_REWARDS.VIEW_IMAGE;
      if (category === 'video') {
        reward = XP_REWARDS.PLAY_VIDEO;
        recordMediaPlay();
      }
      if (category === 'audio') {
        reward = XP_REWARDS.PLAY_AUDIO;
        recordMediaPlay();
      }
      if (category === 'pdf') {
        reward = XP_REWARDS.VIEW_PDF;
        recordPdfView();
      }

      gainXP(reward.xp, reward.coins, reward.message);
      playXPGain();
    },
    [gainXP, recordFileView, recordMediaPlay, recordPdfView]
  );

  // ── FILE DOWNLOAD ──
  const handleFileDownload = useCallback(
    (file: DriveFile) => {
      const r = XP_REWARDS.DOWNLOAD_FILE;
      gainXP(r.xp, r.coins, r.message);
      playDownload();
      playCoin();
      recordDownload();

      // Trigger download
      const url = `/api/drive/download?fileId=${file.id}&fileName=${encodeURIComponent(file.name)}&mimeType=${encodeURIComponent(file.mimeType)}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
    },
    [gainXP, recordDownload]
  );

  // ── SEARCH ──
  const handleSearchClick = useCallback(() => {
    const canCast = spendMP(5);
    if (!canCast) {
      gainXP(0, 0, 'NOT ENOUGH MP!');
      return;
    }
    recordSearch();
    setShowSearch(true);
  }, [spendMP, gainXP, recordSearch]);

  const handleSearchSelect = useCallback(
    (file: DriveFile, folderId: string) => {
      setShowSearch(false);
      const r = XP_REWARDS.SEARCH_FOUND;
      gainXP(r.xp, r.coins, r.message);
      playXPGain();

      if (folderId && folderId !== currentFolderId) {
        setCurrentFolderId(folderId);
        fetchFolder(folderId);
      }

      setTimeout(() => handleFilePreview(file), 300);
    },
    [gainXP, currentFolderId, fetchFolder, handleFilePreview]
  );

  // ── BREADCRUMB NAVIGATION ──
  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      const target = folderStack[index];
      setFolderStack(folderStack.slice(0, index + 1));
      setCurrentFolderId(target.id);
      fetchFolder(target.id);
    },
    [folderStack, fetchFolder]
  );

  // ── RENDER ──

  // Intro screens
  if (introPhase < 3) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'var(--pixel-bg)' }}
      >
        {/* Typing title */}
        <div className="mb-8 text-center">
          <h1 className="text-[16px] sm:text-[20px] font-pixel text-[var(--pixel-black)] tracking-wider">
            {typedTitle}
            <span className="animate-blink text-[var(--pixel-yellow)]">▮</span>
          </h1>
        </div>

        {/* Class assignment */}
        {introPhase >= 1 && (
          <div className="animate-stagger-in flex flex-col items-center gap-3">
            <PixelSprite playerClass={playerClass} size={64} walking />
            <div className="text-[10px] font-pixel text-[var(--pixel-purple)]">
              CLASS ASSIGNED:
            </div>
            <div
              className="text-[14px] font-pixel font-bold px-panel px-4 py-2"
              style={{ color: 'var(--pixel-yellow)' }}
            >
              ⚔ {playerClass} ⚔
            </div>
          </div>
        )}

        {/* XP notification */}
        {introPhase >= 2 && (
          <div className="mt-6">
            <PixelNotification
              message="ADVENTURE BEGINS!"
              xp={50}
              coins={5}
            />
          </div>
        )}
      </div>
    );
  }

  // Loading screen
  if (introPhase === 3 && loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'var(--pixel-bg)' }}
      >
        <PixelSprite playerClass={playerClass} size={48} walking />
        <div className="text-[11px] font-pixel text-[var(--pixel-black)]">
          ENTERING DUNGEON...
        </div>
        <div
          className="w-48 h-4"
          style={{
            border: '3px solid var(--pixel-black)',
            background: '#2a2a3e',
          }}
        >
          <div
            className="h-full"
            style={{
              background: 'var(--pixel-green)',
              width: '60%',
              animation: 'progress-stripe 0.5s linear infinite',
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.15) 6px, rgba(255,255,255,0.15) 8px)',
            }}
          />
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--pixel-bg)' }}>
      {/* Level-up overlay */}
      {showLevelUp && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none"
          style={{ animation: 'px-flash 3s ease-out forwards' }}
        >
          <div className="absolute inset-0 bg-[var(--pixel-yellow)]/20" />
          <div className="relative animate-stagger-in text-center">
            <div
              className="text-[24px] sm:text-[32px] font-pixel font-bold text-[var(--pixel-yellow)] mb-2"
              style={{ textShadow: '4px 4px 0 var(--pixel-black)' }}
            >
              LEVEL UP!
            </div>
            <div
              className="text-[14px] font-pixel text-white"
              style={{ textShadow: '2px 2px 0 var(--pixel-black)' }}
            >
              LV. {newLevel}
            </div>
            <div className="text-[10px] font-pixel text-[var(--pixel-yellow)] mt-2">
              +{newLevel * 5} GOLD · HP RESTORED
            </div>
          </div>
        </div>
      )}

      {/* HUD */}
      <TopBar onSearchClick={handleSearchClick} />

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed bottom-4 left-4 z-50 px-btn bg-[var(--pixel-blue)] text-[var(--pixel-black)] p-3 text-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        📜
      </button>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          folderTree={folderTree}
          currentFolderId={currentFolderId}
          onFolderClick={navigateToFolderById}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumbs */}
          <div
            className="px-4 py-2 flex items-center gap-1 flex-wrap"
            style={{
              borderBottom: '3px solid var(--pixel-black)',
              background: 'var(--pixel-panel)',
            }}
          >
            <span className="text-[8px] font-pixel text-[var(--pixel-gray)]">
              CURRENT ZONE:
            </span>
            {folderStack.map((folder, i) => (
              <span key={folder.id} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="text-[8px] font-pixel text-[var(--pixel-gray)]">
                    ▶
                  </span>
                )}
                <button
                  onClick={() => handleBreadcrumbClick(i)}
                  className="text-[9px] font-pixel hover:text-[var(--pixel-yellow)] transition-colors"
                  style={{
                    color:
                      i === folderStack.length - 1
                        ? 'var(--pixel-yellow)'
                        : 'var(--pixel-blue)',
                  }}
                >
                  📁 {folder.name}
                </button>
              </span>
            ))}
          </div>

          {/* File Grid */}
          <FileGrid
            files={files}
            loading={loading}
            error={error}
            onFolderClick={(folder) => navigateToFolder(folder)}
            onFilePreview={handleFilePreview}
            onFileDownload={handleFileDownload}
          />
        </main>
      </div>

      {/* Floating notifications */}
      <div className="fixed top-20 right-4 z-[80] flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <PixelNotification
            key={n.id}
            message={n.message}
            xp={n.xp}
            coins={n.coins}
          />
        ))}
      </div>

      {/* Modals */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={handleFileDownload}
        />
      )}

      {showSearch && (
        <SearchSpellModal
          onClose={() => setShowSearch(false)}
          onSelectFile={handleSearchSelect}
          allFiles={allFilesFlat}
        />
      )}

      {/* Achievement toasts */}
      <AchievementToast />
    </div>
  );
}
