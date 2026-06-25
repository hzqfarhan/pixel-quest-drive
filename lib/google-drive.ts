// ═══════════════════════════════════════════════════════
// GOOGLE DRIVE API WRAPPER (Server-side only)
// ═══════════════════════════════════════════════════════

const API_KEY = process.env.GOOGLE_API_KEY;
const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  parents?: string[];
  iconLink?: string;
  imageMediaMetadata?: {
    width: number;
    height: number;
  };
  videoMediaMetadata?: {
    width: number;
    height: number;
    durationMillis: string;
  };
}

export interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

const FIELDS = [
  'id', 'name', 'mimeType', 'size', 'thumbnailLink',
  'webViewLink', 'webContentLink', 'createdTime',
  'modifiedTime', 'parents', 'iconLink',
  'imageMediaMetadata', 'videoMediaMetadata'
].join(',');

/**
 * Fetch all files/folders inside a given Drive folder.
 */
export async function fetchFolderContents(folderId: string): Promise<DriveFile[]> {
  const allFiles: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false`,
      key: API_KEY!,
      fields: `nextPageToken,files(${FIELDS})`,
      pageSize: '1000',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
    });

    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const res = await fetch(`${DRIVE_API}?${params.toString()}`, {
      next: { revalidate: 300 }, // 5-minute cache
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        `Drive API error ${res.status}: ${JSON.stringify(error)}`
      );
    }

    const data: DriveListResponse = await res.json();
    allFiles.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return allFiles;
}

/**
 * Fetch metadata for a single file.
 */
export async function fetchFileMetadata(fileId: string): Promise<DriveFile> {
  const params = new URLSearchParams({
    key: API_KEY!,
    fields: FIELDS,
    supportsAllDrives: 'true',
  });

  const res = await fetch(`${DRIVE_API}/${fileId}?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Drive API error ${res.status}`);
  }

  return res.json();
}

/**
 * Recursively fetch ALL files across all subfolders.
 */
export async function fetchAllFilesRecursive(
  folderId: string,
  path: string = ''
): Promise<(DriveFile & { folderPath: string })[]> {
  const files = await fetchFolderContents(folderId);
  const results: (DriveFile & { folderPath: string })[] = [];

  for (const file of files) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      // Recurse into subfolders
      const subFiles = await fetchAllFilesRecursive(
        file.id,
        `${path}/${file.name}`
      );
      results.push(...subFiles);
    } else {
      results.push({ ...file, folderPath: path || '/' });
    }
  }

  return results;
}

/**
 * Check if a mimeType is a Google Workspace type that needs export.
 */
export function isGoogleWorkspaceFile(mimeType: string): boolean {
  return mimeType.startsWith('application/vnd.google-apps.');
}

/**
 * Get the export mimeType for Google Workspace files.
 */
export function getExportMimeType(mimeType: string): string {
  const exportMap: Record<string, string> = {
    'application/vnd.google-apps.document': 'application/pdf',
    'application/vnd.google-apps.spreadsheet': 'application/pdf',
    'application/vnd.google-apps.presentation': 'application/pdf',
    'application/vnd.google-apps.drawing': 'image/png',
  };
  return exportMap[mimeType] || 'application/pdf';
}
