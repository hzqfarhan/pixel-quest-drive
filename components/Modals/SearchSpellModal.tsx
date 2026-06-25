'use client';

import { useState, useCallback } from 'react';
import { type DriveFile } from '@/lib/google-drive';
import { getFileTypeInfo, formatFileSize } from '@/lib/file-utils';
import PixelButton from '@/components/Pixel/PixelButton';

interface SearchSpellModalProps {
  onClose: () => void;
  onSelectFile: (file: DriveFile, folderId: string) => void;
  allFiles: (DriveFile & { folderPath?: string; parentFolderId?: string })[];
}

export default function SearchSpellModal({
  onClose,
  onSelectFile,
  allFiles,
}: SearchSpellModalProps) {
  const [query, setQuery] = useState('');

  const results = query.length >= 2
    ? allFiles
        .filter(
          (f) =>
            f.mimeType !== 'application/vnd.google-apps.folder' &&
            f.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 20)
    : [];

  const handleSelect = useCallback(
    (file: DriveFile & { parentFolderId?: string }) => {
      onSelectFile(file, file.parentFolderId || file.parents?.[0] || '');
    },
    [onSelectFile]
  );

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div
        className="relative w-full max-w-xl flex flex-col"
        style={{
          border: '6px solid var(--pixel-purple)',
          boxShadow: '8px 8px 0 var(--pixel-shadow), 0 0 40px rgba(206, 147, 216, 0.3)',
          background: 'var(--pixel-panel)',
          maxHeight: '80vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            borderBottom: '4px solid var(--pixel-black)',
            background: 'var(--pixel-purple)',
          }}
        >
          <span className="text-2xl">🔮</span>
          <span className="text-[11px] font-pixel text-[var(--pixel-black)] font-bold">
            SEARCH SPELL
          </span>
          <span className="text-[8px] font-pixel text-[var(--pixel-black)] opacity-70 ml-auto">
            -5 MP
          </span>
          <button
            onClick={onClose}
            className="px-btn bg-[var(--pixel-red)] text-white px-2 py-1 text-[10px] font-pixel"
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <div className="p-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ENTER SEARCH INCANTATION..."
            className="px-input w-full text-[9px] font-pixel"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {query.length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center py-8">
              <div className="text-4xl mb-2 opacity-50">😢</div>
              <div className="text-[10px] font-pixel text-[var(--pixel-red)]">
                QUEST FAILED.
              </div>
              <div className="text-[7px] font-pixel text-[var(--pixel-gray)] mt-1">
                No items match your incantation.
              </div>
            </div>
          )}

          {results.map((file) => {
            const typeInfo = getFileTypeInfo(file.mimeType);
            return (
              <button
                key={file.id}
                onClick={() => handleSelect(file)}
                className="w-full text-left px-3 py-2 mb-1 flex items-center gap-2 hover:bg-[var(--pixel-blue)]/10 transition-colors"
                style={{
                  border: '2px solid var(--pixel-black)',
                }}
              >
                <span className="text-lg">{typeInfo.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-pixel truncate">
                    {file.name}
                  </div>
                  <div className="text-[7px] font-pixel text-[var(--pixel-gray)]">
                    {typeInfo.gameName} · {formatFileSize(file.size)}
                    {file.folderPath && ` · ${file.folderPath}`}
                  </div>
                </div>
                <span className="text-[7px] font-pixel text-[var(--pixel-yellow)]">
                  +60 XP
                </span>
              </button>
            );
          })}

          {query.length < 2 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔮</div>
              <div className="text-[8px] font-pixel text-[var(--pixel-gray)]">
                Type at least 2 characters to cast your spell...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
