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
      className="px-card p-3 flex flex-col gap-2 cursor-pointer group relative transition-transform"
      style={{
        animationDelay: `${index * 30}ms`,
        borderColor: 'var(--pixel-blue)',
        background: isHovered ? 'rgba(79, 195, 247, 0.08)' : 'var(--pixel-panel)',
        transform: isHovered ? 'translateY(-2px)' : 'none',
      }}
      onClick={() => onClick(folder)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hogwarts Trunk Image */}
      <div className="w-full aspect-square flex items-center justify-center relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hp/hogwarts-trunk.png"
          alt="Hogwarts Trunk"
          className="w-16 h-16 transition-transform duration-300"
          style={{ 
            imageRendering: 'pixelated',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />

        {/* Sparkles on hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-400 animate-ping" style={{ animationDuration: '0.8s' }} />
            <div className="absolute top-10 right-4 w-1 h-1 bg-yellow-300 animate-ping" style={{ animationDuration: '1.2s' }} />
            <div className="absolute top-4 right-8 w-1 h-1 bg-yellow-200 animate-ping" style={{ animationDuration: '0.9s' }} />
          </div>
        )}
      </div>

      {/* Folder name */}
      <div
        className="text-[9px] font-pixel leading-tight text-center truncate font-bold mt-1"
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
        {isHovered ? '▶ ENTER VAULT' : 'VAULT'}
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
