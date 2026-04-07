import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { mediaManifestPath } from '../util/mediaManifest';
import { uploadAudioToR2 } from './upload-audio-to-r2';

interface PublishOptions {
  dryRun: boolean;
  episode: string;
}

const contentDirectory = path.join(process.cwd(), 'content');
const mediaDirectory = path.join(process.cwd(), 'public', 'media');

function parseArgs(argv: string[]): PublishOptions {
  const args = [...argv];
  let dryRun = false;
  let episode: string | undefined;

  while (args.length > 0) {
    const arg = args.shift();

    if (!arg) {
      continue;
    }

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (episode) {
      throw new Error('Pass only one episode number.');
    }

    episode = arg;
  }

  if (!episode) {
    throw new Error('Usage: pnpm publish-episode [--dry-run] <episode-number>');
  }

  return { dryRun, episode };
}

function normalizeEpisodeNumber(episode: string): {
  commitEpisode: string;
  slug: string;
} {
  if (!/^\d+$/.test(episode)) {
    throw new Error(`Episode number must be numeric: ${episode}`);
  }

  const numericEpisode = Number.parseInt(episode, 10);

  if (!Number.isInteger(numericEpisode) || numericEpisode <= 0) {
    throw new Error(`Episode number must be a positive integer: ${episode}`);
  }

  return {
    commitEpisode: String(numericEpisode),
    slug: String(numericEpisode).padStart(3, '0'),
  };
}

function getEpisodeArtworkPaths(episodeSlug: string): string[] {
  if (!fs.existsSync(mediaDirectory)) {
    return [];
  }

  return fs
    .readdirSync(mediaDirectory)
    .filter(
      (filename) =>
        filename.startsWith(episodeSlug) &&
        filename.toLowerCase().endsWith('.jpg')
    )
    .sort()
    .map((filename) => path.join(mediaDirectory, filename));
}

function ensureFileExists(filePath: string, label: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} does not exist: ${filePath}`);
  }
}

function relativePath(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}

function runCommand(command: string, args: string[], label: string): void {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed`);
  }
}

function readCommandOutput(command: string, args: string[]): string[] {
  const output = execFileSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf-8',
  }).trim();

  if (!output) {
    return [];
  }

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function getCurrentBranch(): string {
  return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  }).trim();
}

function getChangedPaths(): Set<string> {
  return new Set([
    ...readCommandOutput('git', ['diff', '--name-only']),
    ...readCommandOutput('git', ['diff', '--cached', '--name-only']),
    ...readCommandOutput('git', ['ls-files', '--others', '--exclude-standard']),
  ]);
}

function ensureOnlyEpisodeChanges(allowedPaths: string[]): void {
  const allowedPathSet = new Set(allowedPaths);
  const unexpectedPaths = Array.from(getChangedPaths()).filter(
    (changedPath) => !allowedPathSet.has(changedPath)
  );

  if (unexpectedPaths.length > 0) {
    throw new Error(
      `Refusing to publish with unrelated changes present:\n${unexpectedPaths.join('\n')}`
    );
  }
}

function getCommitPaths(paths: string[]): string[] {
  return Array.from(new Set(paths)).sort();
}

function ensureCommitHasChanges(paths: string[]): void {
  const changedPaths = readCommandOutput('git', [
    'diff',
    '--cached',
    '--name-only',
    '--',
    ...paths,
  ]);

  if (changedPaths.length === 0) {
    throw new Error('Nothing to commit for this episode.');
  }
}

async function publishEpisode(argv: string[]): Promise<void> {
  const options = parseArgs(argv);
  const { commitEpisode, slug } = normalizeEpisodeNumber(options.episode);
  const showNotesPath = path.join(contentDirectory, `${slug}.md`);
  const mp3Path = path.join(mediaDirectory, `${slug}.mp3`);
  const artworkPaths = getEpisodeArtworkPaths(slug);

  ensureFileExists(showNotesPath, 'Show notes');
  ensureFileExists(mp3Path, 'MP3');

  if (artworkPaths.length === 0) {
    throw new Error(
      `No JPEG artwork found for episode ${slug}. Expected files like public/media/${slug}.jpg`
    );
  }

  if (getCurrentBranch() !== 'master') {
    throw new Error(
      'Publish from master so the Cloudflare deployment runs automatically.'
    );
  }

  const commitPaths = getCommitPaths([
    relativePath(showNotesPath),
    relativePath(mediaManifestPath),
    ...artworkPaths.map(relativePath),
  ]);

  ensureOnlyEpisodeChanges(commitPaths);

  console.log(`Publishing episode ${commitEpisode}`);
  console.log(`Show notes: ${relativePath(showNotesPath)}`);
  console.log(`Audio upload: ${relativePath(mp3Path)}`);
  console.log(
    `Artwork: ${commitPaths.filter((filePath) => filePath.endsWith('.jpg')).join(', ')}`
  );
  console.log(`Commit message: Ep ${commitEpisode}`);

  if (options.dryRun) {
    console.log('Dry run only. No upload, commit, or push performed.');
    return;
  }

  await uploadAudioToR2([mp3Path]);

  runCommand('git', ['add', '--', ...commitPaths], 'Staging episode files');
  ensureCommitHasChanges(commitPaths);

  runCommand(
    'git',
    ['commit', '--only', '-m', `Ep ${commitEpisode}`, '--', ...commitPaths],
    'Committing episode files'
  );
  runCommand('git', ['push', 'origin', 'master'], 'Pushing master');

  console.log(`Episode ${commitEpisode} published.`);
}

if (require.main === module) {
  publishEpisode(process.argv.slice(2)).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error publishing episode: ${message}`);
    process.exitCode = 1;
  });
}

export { publishEpisode };
