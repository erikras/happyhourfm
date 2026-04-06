import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { type MediaManifest, mediaManifestPath } from '../util/mediaManifest';

const mediaDirectory = path.join(process.cwd(), 'public', 'media');

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

async function getMp3Duration(mp3Path: string): Promise<number> {
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

async function generateMediaManifest(): Promise<void> {
  const filenames = fs
    .readdirSync(mediaDirectory)
    .filter((filename) => filename.endsWith('.mp3'))
    .sort();

  const mediaManifest: MediaManifest = {};

  for (const filename of filenames) {
    const filePath = path.join(mediaDirectory, filename);
    const stat = fs.statSync(filePath);
    const durationSeconds = Math.round(await getMp3Duration(filePath));

    if ((Object.keys(mediaManifest).length + 1) % 25 === 0) {
      console.log(
        `Processed ${Object.keys(mediaManifest).length + 1}/${filenames.length} MP3 files`
      );
    }

    mediaManifest[`media/${filename}`] = {
      sizeBytes: stat.size,
      durationSeconds,
    };
  }

  fs.mkdirSync(path.dirname(mediaManifestPath), { recursive: true });
  fs.writeFileSync(
    mediaManifestPath,
    `${JSON.stringify(mediaManifest, null, 2)}\n`
  );

  console.log(
    `Generated media manifest with ${filenames.length} MP3 entries at ${mediaManifestPath}`
  );
}

if (require.main === module) {
  generateMediaManifest().catch((error) => {
    console.error('Error generating media manifest:', error);
    process.exitCode = 1;
  });
}

export { generateMediaManifest };
