import fs from 'node:fs';
import path from 'node:path';
import {
  type MediaManifest,
  getMediaMetadataForFile,
  saveMediaManifest,
} from '../util/mediaManifest';

const mediaDirectory = path.join(process.cwd(), 'public', 'media');

async function generateMediaManifest(): Promise<void> {
  const filenames = fs
    .readdirSync(mediaDirectory)
    .filter((filename) => filename.endsWith('.mp3'))
    .sort();

  const mediaManifest: MediaManifest = {};

  for (const filename of filenames) {
    const filePath = path.join(mediaDirectory, filename);
    const metadata = await getMediaMetadataForFile(filePath);

    if ((Object.keys(mediaManifest).length + 1) % 25 === 0) {
      console.log(
        `Processed ${Object.keys(mediaManifest).length + 1}/${filenames.length} MP3 files`
      );
    }

    mediaManifest[`media/${filename}`] = metadata;
  }

  saveMediaManifest(mediaManifest);

  console.log(`Generated media manifest with ${filenames.length} MP3 entries`);
}

if (require.main === module) {
  generateMediaManifest().catch((error) => {
    console.error('Error generating media manifest:', error);
    process.exitCode = 1;
  });
}

export { generateMediaManifest };
