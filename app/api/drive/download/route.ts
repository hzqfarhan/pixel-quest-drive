// ═══════════════════════════════════════════════════════
// API ROUTE: GET /api/drive/download?fileId=...&fileName=...
// Streams file from Google Drive to client
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { isGoogleWorkspaceFile, getExportMimeType } from '@/lib/google-drive';

const API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  const fileName = searchParams.get('fileName') || 'download';
  const mimeType = searchParams.get('mimeType') || '';

  if (!fileId) {
    return NextResponse.json(
      { error: 'ITEM NOT FOUND — No file ID' },
      { status: 400 }
    );
  }

  try {
    let url: string;
    let downloadMimeType = mimeType;

    if (isGoogleWorkspaceFile(mimeType)) {
      // Export Google Docs/Sheets/Slides as PDF
      const exportType = getExportMimeType(mimeType);
      url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(exportType)}&key=${API_KEY}`;
      downloadMimeType = exportType;
    } else {
      url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Drive download error: ${response.status}`);
    }

    const headers = new Headers();
    headers.set(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );
    if (downloadMimeType) {
      headers.set('Content-Type', downloadMimeType);
    }
    if (response.headers.get('content-length')) {
      headers.set('Content-Length', response.headers.get('content-length')!);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'ANCIENT RELIC — FAILED TO RETRIEVE' },
      { status: 500 }
    );
  }
}
