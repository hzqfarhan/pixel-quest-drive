// ═══════════════════════════════════════════════════════
// API ROUTE: GET /api/drive/files?folderId=...
// Server-side proxy — hides API key from client
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { fetchFolderContents } from '@/lib/google-drive';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folderId =
    searchParams.get('folderId') ||
    process.env.NEXT_PUBLIC_ROOT_FOLDER_ID ||
    '';

  if (!folderId) {
    return NextResponse.json(
      { error: 'VAULT IS SEALED — No folder ID provided' },
      { status: 400 }
    );
  }

  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: 'MAGIC CRYSTAL MISSING — API key not configured' },
      { status: 500 }
    );
  }

  try {
    const files = await fetchFolderContents(folderId);

    // Sort: folders first, then by type, then alphabetical
    files.sort((a, b) => {
      const aIsFolder = a.mimeType === 'application/vnd.google-apps.folder';
      const bIsFolder = b.mimeType === 'application/vnd.google-apps.folder';

      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;

      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(
      { files, folderId },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Drive API error:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('403')) {
      return NextResponse.json(
        { error: 'VAULT IS SEALED — ACCESS DENIED' },
        { status: 403 }
      );
    }

    if (message.includes('429')) {
      return NextResponse.json(
        { error: 'MAGIC COOLDOWN! Try again in 60s' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'DISCONNECTED FROM THE REALM', details: message },
      { status: 500 }
    );
  }
}
