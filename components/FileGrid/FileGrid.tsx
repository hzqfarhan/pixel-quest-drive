'use client';

import { type DriveFile } from '@/lib/google-drive';
import FileCard from './FileCard';
import FolderCard from './FolderCard';
import EmptyState from './EmptyState';

interface FileGridProps {
  files: DriveFile[];
  loading: boolean;
  error?: string;
  onFolderClick: (folder: DriveFile) => void;
  onFilePreview: (file: DriveFile) => void;
  onFileDownload: (file: DriveFile) => void;
}

export default function FileGrid({
  files,
  loading,
  error,
  onFolderClick,
  onFilePreview,
  onFileDownload,
}: FileGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-4xl mb-4">⚠️</div>
        <div className="text-[12px] font-pixel text-[var(--pixel-red)] text-center mb-2">
          CONNECTION LOST
        </div>
        <div className="text-[8px] font-pixel text-[var(--pixel-gray)] text-center max-w-[300px]">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return <EmptyState />;
  }

  const folders = files.filter(
    (f) => f.mimeType === 'application/vnd.google-apps.folder'
  );
  const nonFolders = files.filter(
    (f) => f.mimeType !== 'application/vnd.google-apps.folder'
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {folders.map((folder, i) => (
        <div key={folder.id} className="animate-stagger-in" style={{ animationDelay: `${i * 30}ms` }}>
          <FolderCard
            folder={folder}
            index={i}
            onClick={onFolderClick}
          />
        </div>
      ))}
      {nonFolders.map((file, i) => (
        <div
          key={file.id}
          className="animate-stagger-in relative"
          style={{ animationDelay: `${(folders.length + i) * 30}ms` }}
        >
          <FileCard
            file={file}
            index={folders.length + i}
            onPreview={onFilePreview}
            onDownload={onFileDownload}
          />
        </div>
      ))}
    </div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="animate-stagger-in"
      style={{
        animationDelay: `${index * 50}ms`,
        border: '4px solid var(--pixel-black)',
        boxShadow: '4px 4px 0 var(--pixel-shadow)',
        background: 'var(--pixel-panel)',
        padding: '12px',
      }}
    >
      <div className="flex justify-between mb-2">
        <div className="w-16 h-4" style={{ background: 'var(--pixel-gray)', opacity: 0.3 }} />
        <div className="w-6 h-6" style={{ background: 'var(--pixel-gray)', opacity: 0.2 }} />
      </div>
      <div
        className="w-full aspect-square mb-2"
        style={{
          background: 'var(--pixel-gray)',
          opacity: 0.15,
          animation: 'cursor-blink 1.5s ease-in-out infinite',
        }}
      />
      <div className="w-3/4 h-3 mb-1" style={{ background: 'var(--pixel-gray)', opacity: 0.2 }} />
      <div className="w-1/2 h-2" style={{ background: 'var(--pixel-gray)', opacity: 0.15 }} />
    </div>
  );
}
