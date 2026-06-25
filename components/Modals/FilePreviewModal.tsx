'use client';

import { type DriveFile } from '@/lib/google-drive';
import { getFileCategory, getFileTypeInfo, formatFileSize, getDocsViewerUrl } from '@/lib/file-utils';
import PixelButton from '@/components/Pixel/PixelButton';

interface FilePreviewModalProps {
  file: DriveFile;
  onClose: () => void;
  onDownload: (file: DriveFile) => void;
}

export default function FilePreviewModal({ file, onClose, onDownload }: FilePreviewModalProps) {
  const category = getFileCategory(file.mimeType);
  const typeInfo = getFileTypeInfo(file.mimeType);

  const getPreviewUrl = (fileId: string, mimeType: string) => {
    // For images, use direct Drive thumbnail at high res
    if (mimeType.startsWith('image/')) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
    }
    return null;
  };

  const getEmbedUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col"
        style={{
          border: '6px solid var(--pixel-black)',
          boxShadow: '8px 8px 0 var(--pixel-shadow)',
          background: 'var(--pixel-panel)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-4 py-2 shrink-0"
          style={{
            borderBottom: '4px solid var(--pixel-black)',
            background: 'var(--pixel-bg)',
          }}
        >
          <span className="text-xl">{typeInfo.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-pixel truncate text-[var(--pixel-black)]">
              {file.name}
            </div>
            <div className="text-[7px] font-pixel text-[var(--pixel-gray)]">
              {typeInfo.gameName} · {formatFileSize(file.size)}
            </div>
          </div>
          <PixelButton
            variant="gold"
            size="sm"
            onClick={() => onDownload(file)}
          >
            ⬇ GET
          </PixelButton>
          <button
            onClick={onClose}
            className="px-btn bg-[var(--pixel-red)] text-white px-2 py-1 text-[10px] font-pixel"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[300px]">
          {category === 'image' && (
            <img
              src={getPreviewUrl(file.id, file.mimeType) || ''}
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain"
              style={{
                border: '3px solid var(--pixel-black)',
                boxShadow: '4px 4px 0 var(--pixel-shadow)',
                imageRendering: 'auto',
              }}
            />
          )}

          {category === 'video' && (
            <div className="w-full max-w-3xl">
              <iframe
                src={getEmbedUrl(file.id)}
                className="w-full aspect-video"
                style={{
                  border: '3px solid var(--pixel-black)',
                  boxShadow: '4px 4px 0 var(--pixel-shadow)',
                }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}

          {category === 'audio' && (
            <div className="w-full max-w-md">
              <div className="px-panel p-6 flex flex-col items-center gap-4">
                <div className="text-6xl animate-walk">🎵</div>
                <div className="text-[10px] font-pixel text-center">{file.name}</div>
                <iframe
                  src={getEmbedUrl(file.id)}
                  className="w-full h-[80px]"
                  style={{
                    border: '3px solid var(--pixel-black)',
                  }}
                  allow="autoplay"
                />
              </div>
            </div>
          )}

          {category === 'pdf' && (
            <iframe
              src={getEmbedUrl(file.id)}
              className="w-full h-[70vh]"
              style={{
                border: '3px solid var(--pixel-black)',
                boxShadow: '4px 4px 0 var(--pixel-shadow)',
              }}
            />
          )}

          {(category === 'document' ||
            category === 'spreadsheet' ||
            category === 'presentation') && (
            <iframe
              src={getDocsViewerUrl(file.id)}
              className="w-full h-[70vh]"
              style={{
                border: '3px solid var(--pixel-black)',
                boxShadow: '4px 4px 0 var(--pixel-shadow)',
              }}
            />
          )}

          {(category === 'text' || category === 'code') && (
            <iframe
              src={getEmbedUrl(file.id)}
              className="w-full h-[70vh]"
              style={{
                border: '3px solid var(--pixel-black)',
                boxShadow: '4px 4px 0 var(--pixel-shadow)',
                background: '#1a1a2e',
              }}
            />
          )}

          {(category === 'unknown' || category === 'archive') && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-6xl">{typeInfo.emoji}</div>
              <div className="text-[11px] font-pixel text-[var(--pixel-black)]">
                {typeInfo.gameName}
              </div>
              <div className="text-[8px] font-pixel text-[var(--pixel-gray)] text-center">
                This relic cannot be inspected here.
                <br />
                Download it to reveal its contents.
              </div>
              <PixelButton
                variant="gold"
                size="lg"
                onClick={() => onDownload(file)}
              >
                ⬇ DOWNLOAD {typeInfo.gameName}
              </PixelButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
