import fs from 'node:fs';
import path from 'node:path';

export interface MediaMetadata {
  sizeBytes: number;
  durationSeconds: number;
}

export type MediaManifest = Record<string, MediaMetadata>;

export const mediaManifestPath = path.join(
  process.cwd(),
  'data',
  'media-manifest.json'
);

export function loadMediaManifest(): MediaManifest {
  try {
    return JSON.parse(
      fs.readFileSync(mediaManifestPath, 'utf-8')
    ) as MediaManifest;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not read media manifest at ${mediaManifestPath}: ${message}`
    );
  }
}

export function getMediaMetadata(
  mediaManifest: MediaManifest,
  mp3URL: string
): MediaMetadata {
  const mediaMetadata = mediaManifest[mp3URL];

  if (!mediaMetadata) {
    console.warn(
      `Missing media metadata for ${mp3URL} in ${mediaManifestPath}`
    );
    return {
      sizeBytes: 0,
      durationSeconds: 0,
    };
  }

  return {
    sizeBytes: Number.isFinite(mediaMetadata.sizeBytes)
      ? mediaMetadata.sizeBytes
      : 0,
    durationSeconds: Number.isFinite(mediaMetadata.durationSeconds)
      ? Math.round(mediaMetadata.durationSeconds)
      : 0,
  };
}
