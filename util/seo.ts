import { defaultImage, description, title, url } from './constants';

export const siteUrl = `${url}/`;
export const rssUrl = `${url}/rss.xml`;

// Pass to `alternates.types` so every page advertises the podcast feed
export const rssAlternate = {
  'application/rss+xml': [{ url: rssUrl, title }],
};

export const episodeUrl = (slug: string) => `${url}/${slug}`;

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return `${url}/${pathOrUrl.replace(/^\//, '')}`;
}

export function toIsoDate(date: string | Date): string {
  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsed.getTime())
    ? String(date)
    : parsed.toISOString().split('T')[0];
}

// Search engines show ~155-160 characters; cut long summaries at a word
export function truncateDescription(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  const cut = normalized.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–-]+$/, '')}…`;
}

export function isoDuration(totalSeconds: number): string | undefined {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return undefined;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `PT${hours ? `${hours}H` : ''}${minutes ? `${minutes}M` : ''}${seconds ? `${seconds}S` : ''}`;
}

const series = {
  '@type': 'PodcastSeries',
  name: title,
  url: siteUrl,
};

export function podcastSeriesJsonLd() {
  return {
    '@context': 'https://schema.org',
    ...series,
    description,
    image: defaultImage,
    webFeed: rssUrl,
    inLanguage: 'en-US',
    author: [
      { '@type': 'Person', name: 'Erik Rasmussen' },
      { '@type': 'Person', name: 'Dennis Schrantz' },
    ],
  };
}

interface EpisodeJsonLdInput {
  slug: string;
  title: string;
  description: string;
  date: string;
  episode?: number;
  art?: string;
  mp3URL: string;
  durationSeconds: number;
}

export function podcastEpisodeJsonLd(ep: EpisodeJsonLdInput) {
  const duration = isoDuration(ep.durationSeconds);
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    url: episodeUrl(ep.slug),
    name: ep.title,
    description: ep.description,
    datePublished: toIsoDate(ep.date),
    ...(ep.episode !== undefined ? { episodeNumber: ep.episode } : {}),
    image: ep.art ? absoluteUrl(ep.art) : defaultImage,
    ...(duration ? { timeRequired: duration } : {}),
    associatedMedia: {
      '@type': 'AudioObject',
      contentUrl: absoluteUrl(ep.mp3URL),
      encodingFormat: 'audio/mpeg',
      ...(duration ? { duration } : {}),
    },
    partOfSeries: series,
  };
}

// Escape `<` so show-note text can never close the surrounding <script> tag
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
