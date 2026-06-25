'use client';

import { useGameStore } from '@/store/useGameStore';
import { getRankTitle, getClassColor } from '@/lib/gamification';
import PixelSprite from '@/components/Pixel/PixelSprite';

interface SidebarProps {
  folderTree: { id: string; name: string; depth: number }[];
  currentFolderId: string;
  onFolderClick: (folderId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  folderTree,
  currentFolderId,
  onFolderClick,
  isOpen,
  onClose,
}: SidebarProps) {
  const {
    playerClass, level, coins, filesViewed,
    filesDownloaded, foldersExplored, totalFolders,
    achievements, sessionStartTime,
  } = useGameStore();

  const rank = getRankTitle(level);
  const classColor = getClassColor(playerClass);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
  const timeStr = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full z-40 overflow-y-auto transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          width: '260px',
          background: 'var(--pixel-panel)',
          borderRight: '4px solid var(--pixel-black)',
          boxShadow: '4px 0 0 var(--pixel-shadow)',
        }}
      >
        <div className="p-3 space-y-4">
          {/* Player Card */}
          <div className="px-panel p-3">
            <div className="flex items-center gap-2 mb-2">
              <PixelSprite playerClass={playerClass} size={24} />
              <div>
                <div className="text-[9px] font-pixel font-bold" style={{ color: classColor }}>
                  {playerClass}
                </div>
                <div className="text-[7px] font-pixel text-[var(--pixel-purple)]">
                  [{rank}]
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[7px] font-pixel">
              <StatRow label="LEVEL" value={level.toString()} />
              <StatRow label="GALLEONS" value={coins.toString()} color="var(--pixel-yellow)" />
              <StatRow label="FILES" value={filesViewed.toString()} />
              <StatRow label="DLS" value={filesDownloaded.toString()} />
              <StatRow label="VAULTS" value={`${foldersExplored.length}/${totalFolders || '?'}`} />
              <StatRow label="TIME" value={timeStr} />
            </div>
          </div>

          {/* Quest Log / Minimap */}
          <div className="px-panel p-3">
            <div className="text-[9px] font-pixel font-bold mb-2 flex items-center gap-1">
              <span>📜</span> QUEST LOG
            </div>
            <div className="space-y-1">
              {folderTree.length === 0 && (
                <div className="text-[7px] font-pixel text-[var(--pixel-gray)]">
                  Loading map...
                </div>
              )}
              {folderTree.map((folder) => {
                const isActive = folder.id === currentFolderId;
                const isExplored = foldersExplored.includes(folder.id);

                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onFolderClick(folder.id);
                      onClose();
                    }}
                    className="block w-full text-left text-[7px] font-pixel py-0.5 px-1 transition-colors hover:bg-[var(--pixel-blue)]/10"
                    style={{
                      paddingLeft: `${8 + folder.depth * 12}px`,
                      color: isActive
                        ? 'var(--pixel-yellow)'
                        : isExplored
                        ? 'var(--pixel-black)'
                        : 'var(--pixel-gray)',
                      background: isActive ? 'rgba(79, 195, 247, 0.15)' : undefined,
                    }}
                  >
                    {isActive && (
                      <span className="animate-blink mr-1">▶</span>
                    )}
                    {isExplored ? '✓ ' : '? '}
                    <span>📁 {folder.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="px-panel p-3">
            <div className="text-[9px] font-pixel font-bold mb-2 flex items-center gap-1">
              <span>🏆</span> ACHIEVEMENTS
              <span className="text-[var(--pixel-yellow)] ml-auto">
                {unlockedCount}/{achievements.length}
              </span>
            </div>
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-center gap-1 text-[7px] font-pixel"
                  style={{
                    color: ach.unlocked ? 'var(--pixel-green)' : 'var(--pixel-gray)',
                    opacity: ach.unlocked ? 1 : 0.5,
                  }}
                >
                  <span>{ach.unlocked ? '✓' : '✗'}</span>
                  <span>{ach.emoji}</span>
                  <span className="truncate">{ach.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--pixel-gray)]">{label}</span>
      <span style={{ color: color || 'var(--pixel-black)' }}>{value}</span>
    </div>
  );
}
