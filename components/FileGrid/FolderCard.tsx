'use client';

import { useState } from 'react';
import { type DriveFile } from '@/lib/google-drive';

interface FolderCardProps {
  folder: DriveFile;
  index: number;
  itemCount?: number;
  onClick: (folder: DriveFile) => void;
}

export default function FolderCard({ folder, index, itemCount, onClick }: FolderCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="px-card p-3 flex flex-col gap-2 cursor-pointer group relative"
      style={{
        animationDelay: `${index * 30}ms`,
        borderColor: 'var(--pixel-blue)',
        background: isHovered ? 'rgba(79, 195, 247, 0.08)' : 'var(--pixel-panel)',
      }}
      onClick={() => onClick(folder)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Chest SVG */}
      <div className="w-full aspect-square flex items-center justify-center">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Chest body */}
          <rect x="8" y="32" width="64" height="40" fill="#8B4513" />
          <rect x="8" y="32" width="64" height="4" fill="#A0522D" />
          <rect x="8" y="68" width="64" height="4" fill="#654321" />
          {/* Side details */}
          <rect x="8" y="32" width="4" height="40" fill="#654321" />
          <rect x="68" y="32" width="4" height="40" fill="#654321" />
          {/* Metal bands */}
          <rect x="8" y="44" width="64" height="4" fill="#DAA520" />
          <rect x="8" y="56" width="64" height="4" fill="#DAA520" />
          {/* Lock */}
          <rect x="32" y="44" width="16" height="16" fill="#FFD700" />
          <rect x="36" y="48" width="8" height="8" fill="#8B4513" />
          <rect x="38" y="52" width="4" height="4" fill="#1a1a2e" />

          {/* Lid */}
          <g
            style={{
              transformOrigin: '40px 32px',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'rotateX(-30deg) translateY(-8px)' : 'rotateX(0deg)',
            }}
          >
            <rect x="4" y="16" width="72" height="20" fill="#A0522D" />
            <rect x="4" y="16" width="72" height="4" fill="#CD853F" />
            <rect x="4" y="16" width="4" height="20" fill="#8B4513" />
            <rect x="72" y="16" width="4" height="20" fill="#8B4513" />
            <rect x="4" y="24" width="72" height="4" fill="#DAA520" />
          </g>

          {/* Sparkles on hover */}
          {isHovered && (
            <>
              <rect x="16" y="8" width="4" height="4" fill="#FFD700" opacity="0.8">
                <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" />
              </rect>
              <rect x="56" y="4" width="4" height="4" fill="#FFD700" opacity="0.6">
                <animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.3s" repeatCount="indefinite" />
              </rect>
              <rect x="36" y="2" width="4" height="4" fill="#FFD700" opacity="0.7">
                <animate attributeName="opacity" values="0;1;0" dur="0.7s" begin="0.5s" repeatCount="indefinite" />
              </rect>
            </>
          )}
        </svg>
      </div>

      {/* Folder name */}
      <div
        className="text-[9px] font-pixel leading-tight text-center truncate font-bold"
        title={folder.name}
        style={{ color: 'var(--pixel-blue)' }}
      >
        🏰 {folder.name}
      </div>

      {/* Item count */}
      {itemCount !== undefined && (
        <div className="text-[7px] font-pixel text-center text-[var(--pixel-gray)]">
          {itemCount} ITEMS
        </div>
      )}

      {/* Enter label */}
      <div className="text-[7px] font-pixel text-center text-[var(--pixel-yellow)]">
        {isHovered ? '▶ ENTER DUNGEON' : 'DUNGEON'}
      </div>

      {/* Hover XP preview */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[8px] font-pixel font-bold text-[var(--pixel-yellow)]" style={{ textShadow: '1px 1px 0 var(--pixel-black)' }}>
          +25 XP
        </span>
      </div>
    </div>
  );
}
