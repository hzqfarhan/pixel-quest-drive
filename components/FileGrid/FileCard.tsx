'use client';

import { type DriveFile } from '@/lib/google-drive';
import { getFileTypeInfo, formatFileSize, formatDate } from '@/lib/file-utils';
import { getRarityInfo, getFileRarity } from '@/lib/rarity';
import PixelBadge from '@/components/Pixel/PixelBadge';

interface FileCardProps {
  file: DriveFile;
  index: number;
  onPreview: (file: DriveFile) => void;
  onDownload: (file: DriveFile) => void;
}

export default function FileCard({ file, index, onPreview, onDownload }: FileCardProps) {
  const typeInfo = getFileTypeInfo(file.mimeType);
  const rarity = getFileRarity(file.mimeType, file.size);
  const rarityInfo = getRarityInfo(file.mimeType, file.size);
  const isGif = file.mimeType === 'image/gif';

  if (isGif) {
    return (
      <div
        className="relative flex flex-col items-center justify-center cursor-pointer group hover:-translate-y-2 transition-transform duration-300"
        style={{ animationDelay: `${index * 30}ms` }}
        onClick={() => onPreview(file)}
      >
        <div className="w-full aspect-square flex items-center justify-center">
          <img
            src={`https://drive.google.com/uc?export=view&id=${file.id}`}
            alt={file.name}
            className="w-full h-full object-contain"
            style={{ 
              imageRendering: 'pixelated', 
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' 
            }}
          />
        </div>
        {/* Name underneath, no border */}
        <div
          className="text-[8px] font-pixel text-center mt-2 truncate w-full px-2"
          style={{ color: 'var(--text-primary)', textShadow: '2px 2px 0 var(--pixel-black)' }}
        >
          {file.name}
        </div>
        {/* Hover XP preview */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[8px] font-pixel font-bold text-[var(--pixel-yellow)]" style={{ textShadow: '1px 1px 0 var(--pixel-black)' }}>
            +30 XP
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`px-card ${rarityInfo.cssClass} p-3 flex flex-col gap-2 cursor-pointer group`}
      style={{
        animationDelay: `${index * 30}ms`,
        borderColor: rarityInfo.borderColor,
      }}
      onClick={() => onPreview(file)}
    >
      {/* Top row: rarity badge + type emoji */}
      <div className="flex justify-between items-start">
        <PixelBadge rarity={rarity} />
        <span className="text-2xl" role="img" aria-label={typeInfo.label}>
          {typeInfo.emoji}
        </span>
      </div>

      {/* Thumbnail / Icon area */}
      <div
        className="w-full aspect-square flex items-center justify-center overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.03)',
          border: '2px solid var(--pixel-shadow)',
        }}
      >
        {file.thumbnailLink ? (
          <img
            src={file.thumbnailLink.replace(/=s\d+/, '=s200')}
            alt={file.name}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ imageRendering: 'auto' }}
          />
        ) : (
          <div className="text-5xl opacity-50">{typeInfo.emoji}</div>
        )}
      </div>

      {/* File name */}
      <div
        className="text-[8px] font-pixel leading-tight truncate"
        title={file.name}
        style={{ color: 'var(--text-primary)' }}
      >
        {file.name}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 text-[7px] font-pixel text-[var(--pixel-gray)]">
        <span>📏 {formatFileSize(file.size)}</span>
        <span>📅 {formatDate(file.modifiedTime)}</span>
      </div>

      {/* Game label */}
      <div className="text-[7px] font-pixel" style={{ color: typeInfo.color }}>
        ⚔ {typeInfo.gameName}
      </div>

      {/* Action buttons */}
      <div className="flex gap-1 mt-auto">
        <button
          className="flex-1 glass-btn text-white px-1 py-2 text-[7px] font-pixel flex items-center justify-center gap-1 transition-all duration-300 hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(file);
          }}
        >
          👁 VIEW
        </button>
        <button
          className="flex-1 glass-btn text-white px-1 py-2 text-[7px] font-pixel flex items-center justify-center gap-1 transition-all duration-300 hover:scale-105"
          style={{ background: 'rgba(255, 180, 0, 0.2)' }}
          onClick={(e) => {
            e.stopPropagation();
            onDownload(file);
          }}
        >
          ⬇ GET
        </button>
      </div>

      {/* Hover XP preview */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[8px] font-pixel font-bold text-[var(--pixel-yellow)]" style={{ textShadow: '1px 1px 0 var(--pixel-black)' }}>
          +30 XP
        </span>
      </div>
    </div>
  );
}
