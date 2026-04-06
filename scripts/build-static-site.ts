import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const mediaDirectory = path.join(process.cwd(), 'public', 'media');
const exportedMediaDirectory = path.join(process.cwd(), 'out', 'media');

function moveAudioFiles(
  sourceDirectory: string,
  targetDirectory: string
): string[] {
  if (!fs.existsSync(sourceDirectory)) {
    return [];
  }

  const filenames = fs
    .readdirSync(sourceDirectory)
    .filter((filename) => filename.endsWith('.mp3'));

  if (filenames.length === 0) {
    return [];
  }

  fs.mkdirSync(targetDirectory, { recursive: true });

  for (const filename of filenames) {
    fs.renameSync(
      path.join(sourceDirectory, filename),
      path.join(targetDirectory, filename)
    );
  }

  return filenames;
}

function restoreAudioFiles(
  sourceDirectory: string,
  targetDirectory: string,
  filenames: string[]
) {
  for (const filename of filenames) {
    const sourcePath = path.join(sourceDirectory, filename);
    const targetPath = path.join(targetDirectory, filename);

    if (fs.existsSync(sourcePath)) {
      fs.renameSync(sourcePath, targetPath);
    }
  }

  if (fs.existsSync(sourceDirectory)) {
    fs.rmSync(sourceDirectory, { recursive: true, force: true });
  }
}

function runStaticBuild() {
  const result = spawnSync('pnpm', ['exec', 'next', 'build'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(
      `next build exited with status ${result.status ?? 'unknown'}`
    );
  }
}

function removeExportedAudioFiles() {
  if (!fs.existsSync(exportedMediaDirectory)) {
    return;
  }

  const filenames = fs
    .readdirSync(exportedMediaDirectory)
    .filter((filename) => filename.endsWith('.mp3'));

  for (const filename of filenames) {
    fs.rmSync(path.join(exportedMediaDirectory, filename), { force: true });
  }
}

async function buildStaticSite() {
  const tempDirectory = fs.mkdtempSync(
    path.join(process.cwd(), '.cloudflare-build-media-')
  );
  const hiddenAudioFiles = moveAudioFiles(mediaDirectory, tempDirectory);

  try {
    if (hiddenAudioFiles.length > 0) {
      console.log(
        `Temporarily hiding ${hiddenAudioFiles.length} MP3 files from the static export`
      );
    }

    runStaticBuild();
    removeExportedAudioFiles();
  } finally {
    restoreAudioFiles(tempDirectory, mediaDirectory, hiddenAudioFiles);
  }
}

if (require.main === module) {
  buildStaticSite().catch((error) => {
    console.error('Static build failed:', error);
    process.exitCode = 1;
  });
}

export { buildStaticSite };
