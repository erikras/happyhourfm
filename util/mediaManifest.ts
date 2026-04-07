import { execFileSync } from 'node:child_process';
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

function sortMediaManifest(mediaManifest: MediaManifest): MediaManifest {
  return Object.fromEntries(
    Object.entries(mediaManifest).sort(([left], [right]) =>
      left.localeCompare(right)
    )
  );
}

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

export function saveMediaManifest(mediaManifest: MediaManifest): void {
  fs.mkdirSync(path.dirname(mediaManifestPath), { recursive: true });
  fs.writeFileSync(
    mediaManifestPath,
    `${JSON.stringify(sortMediaManifest(mediaManifest), null, 2)}\n`
  );
}

function getMp3DurationWithLibrary(mp3Path: string): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const mp3Duration = require('mp3-duration');
      mp3Duration(mp3Path, (error: Error | null, duration: number) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(duration || 0);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function getMp3Duration(mp3Path: string): Promise<number> {
  try {
    const output = execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        mp3Path,
      ],
      {
        encoding: 'utf-8',
      }
    ).trim();
    const duration = Number.parseFloat(output);

    if (Number.isFinite(duration)) {
      return duration;
    }
  } catch (_error) {
    console.warn(`ffprobe duration lookup failed for ${mp3Path}, falling back`);
  }

  return getMp3DurationWithLibrary(mp3Path);
}

export async function getMediaMetadataForFile(
  filePath: string
): Promise<MediaMetadata> {
  const stat = fs.statSync(filePath);

  return {
    sizeBytes: stat.size,
    durationSeconds: Math.round(await getMp3Duration(filePath)),
  };
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
