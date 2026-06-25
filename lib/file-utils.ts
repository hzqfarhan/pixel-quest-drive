// ═══════════════════════════════════════════════════════
// FILE UTILITIES — MIME detection, icons, size formatting
// ═══════════════════════════════════════════════════════

export type FileCategory =
  | 'folder'
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'spreadsheet'
  | 'presentation'
  | 'document'
  | 'archive'
  | 'text'
  | 'code'
  | 'unknown';

export interface FileTypeInfo {
  category: FileCategory;
  emoji: string;
  label: string;
  gameName: string;
  color: string;
}

const FILE_TYPE_MAP: Record<string, FileTypeInfo> = {
  folder: {
    category: 'folder',
    emoji: '🏰',
    label: 'DUNGEON',
    gameName: 'DUNGEON',
    color: 'var(--pixel-blue)',
  },
  image: {
    category: 'image',
    emoji: '🖼️',
    label: 'ARTIFACT',
    gameName: 'ARTIFACT',
    color: 'var(--pixel-purple)',
  },
  video: {
    category: 'video',
    emoji: '🔮',
    label: 'VISION STONE',
    gameName: 'VISION STONE',
    color: '#2ABFBF',
  },
  audio: {
    category: 'audio',
    emoji: '🎵',
    label: 'BARD RUNE',
    gameName: 'BARD RUNE',
    color: 'var(--pixel-orange)',
  },
  pdf: {
    category: 'pdf',
    emoji: '📜',
    label: 'ANCIENT TEXT',
    gameName: 'ANCIENT TEXT',
    color: 'var(--pixel-yellow)',
  },
  spreadsheet: {
    category: 'spreadsheet',
    emoji: '📊',
    label: 'MERCHANT TOME',
    gameName: 'MERCHANT TOME',
    color: 'var(--pixel-green)',
  },
  presentation: {
    category: 'presentation',
    emoji: '📕',
    label: 'GRIMOIRE',
    gameName: 'GRIMOIRE',
    color: 'var(--pixel-purple)',
  },
  document: {
    category: 'document',
    emoji: '📄',
    label: 'DECREE',
    gameName: 'DECREE',
    color: '#FFFFFF',
  },
  archive: {
    category: 'archive',
    emoji: '📦',
    label: 'LOOT BAG',
    gameName: 'LOOT BAG',
    color: 'var(--pixel-yellow)',
  },
  text: {
    category: 'text',
    emoji: '🪨',
    label: 'RUNE TABLET',
    gameName: 'RUNE TABLET',
    color: 'var(--pixel-gray)',
  },
  code: {
    category: 'code',
    emoji: '⚙️',
    label: 'MECHANISM',
    gameName: 'MECHANISM',
    color: '#2ABFBF',
  },
  unknown: {
    category: 'unknown',
    emoji: '❓',
    label: 'UNKNOWN RELIC',
    gameName: 'UNKNOWN RELIC',
    color: 'var(--pixel-red)',
  },
};

/**
 * Detect file category from MIME type.
 */
export function getFileCategory(mimeType: string): FileCategory {
  if (mimeType === 'application/vnd.google-apps.folder') return 'folder';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    mimeType === 'text/csv' ||
    mimeType === 'application/vnd.google-apps.spreadsheet'
  )
    return 'spreadsheet';
  if (
    mimeType.includes('presentation') ||
    mimeType.includes('powerpoint') ||
    mimeType === 'application/vnd.google-apps.presentation'
  )
    return 'presentation';
  if (
    mimeType.includes('document') ||
    mimeType.includes('msword') ||
    mimeType === 'application/vnd.google-apps.document' ||
    mimeType === 'application/rtf'
  )
    return 'document';
  if (
    mimeType.includes('zip') ||
    mimeType.includes('rar') ||
    mimeType.includes('tar') ||
    mimeType.includes('7z') ||
    mimeType.includes('compressed') ||
    mimeType.includes('archive')
  )
    return 'archive';
  if (mimeType.startsWith('text/')) return 'text';
  if (
    mimeType.includes('javascript') ||
    mimeType.includes('json') ||
    mimeType.includes('xml') ||
    mimeType.includes('python') ||
    mimeType.includes('java') ||
    mimeType.includes('typescript')
  )
    return 'code';
  return 'unknown';
}

/**
 * Get full file type info (emoji, label, color) from MIME type.
 */
export function getFileTypeInfo(mimeType: string): FileTypeInfo {
  const category = getFileCategory(mimeType);
  return FILE_TYPE_MAP[category] || FILE_TYPE_MAP.unknown;
}

/**
 * Format file size in bytes to human-readable string.
 */
export function formatFileSize(bytes?: string | number): string {
  if (!bytes) return '???';
  const size = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(size)) return '???';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let value = size;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format date string to short display.
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return '???';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get the file extension from a filename.
 */
export function getFileExtension(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? `.${parts.pop()!.toLowerCase()}` : '';
}

/**
 * Get a thumbnail URL from the Drive thumbnailLink at the desired size.
 */
export function getThumbnailUrl(
  thumbnailLink?: string,
  size: number = 400
): string | undefined {
  if (!thumbnailLink) return undefined;
  return thumbnailLink.replace(/=s\d+/, `=s${size}`);
}

/**
 * Build a Google Docs Viewer URL for embedding.
 */
export function getDocsViewerUrl(fileId: string): string {
  return `https://docs.google.com/viewer?srcid=${fileId}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`;
}

/**
 * Build a direct download URL.
 */
export function getDownloadUrl(fileId: string): string {
  return `/api/drive/download?fileId=${fileId}`;
}

/**
 * Check if a file can be previewed in-app.
 */
export function canPreview(mimeType: string): boolean {
  const category = getFileCategory(mimeType);
  return ['image', 'video', 'audio', 'pdf', 'document', 'spreadsheet', 'presentation', 'text', 'code'].includes(category);
}
