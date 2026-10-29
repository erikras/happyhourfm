import { describe, expect, it } from 'vitest';
import {
  isoDuration,
  podcastEpisodeJsonLd,
  serializeJsonLd,
  truncateDescription,
} from '../util/seo';
import { buildEpisodeRedirects } from './generate-redirects';
import { buildSitemap, getSitemapEntries } from './generate-sitemap';

describe('sitemap', () => {
  it('lists the home page and every episode with https canonical URLs', () => {
    const entries = getSitemapEntries();

    expect(entries[0].loc).toBe('https://happyhour.fm/');
    expect(entries.map((entry) => entry.loc)).toContain(
      'https://happyhour.fm/001'
    );
    for (const entry of entries) {
      expect(entry.loc).toMatch(/^https:\/\/happyhour\.fm\//);
      expect(entry.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('renders valid sitemap XML', () => {
    expect(
      buildSitemap([
        { loc: 'https://happyhour.fm/', lastmod: '2026-01-01' },
        { loc: 'https://happyhour.fm/001' },
      ])
    ).toBe(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://happyhour.fm/</loc>
    <lastmod>2026-01-01</lastmod>
  </url>
  <url>
    <loc>https://happyhour.fm/001</loc>
  </url>
</urlset>
`);
  });
});

describe('buildEpisodeRedirects', () => {
  it('redirects unpadded numbers and RSS guid paths to episode slugs', () => {
    expect(buildEpisodeRedirects(['007', '288', 'not-an-episode'])).toEqual([
      '/episode/7 /007 301',
      '/episode/007 /007 301',
      '/7 /007 301',
      '/episode/288 /288 301',
    ]);
  });
});

describe('seo helpers', () => {
  it('truncates long descriptions at a word boundary', () => {
    const text = 'word '.repeat(60);
    const result = truncateDescription(text);

    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith('word…')).toBe(true);
    expect(truncateDescription('Short and sweet.')).toBe('Short and sweet.');
  });

  it('formats ISO 8601 durations', () => {
    expect(isoDuration(3725)).toBe('PT1H2M5S');
    expect(isoDuration(600)).toBe('PT10M');
    expect(isoDuration(0)).toBeUndefined();
  });

  it('builds PodcastEpisode JSON-LD', () => {
    const data = podcastEpisodeJsonLd({
      slug: '016',
      title: 'Ep. 16 - Title',
      description: 'Description',
      date: '2019-07-19',
      episode: 16,
      art: 'media/016.jpg',
      mp3URL: 'media/016.mp3',
      durationSeconds: 3600,
    });

    expect(data).toMatchObject({
      '@type': 'PodcastEpisode',
      url: 'https://happyhour.fm/016',
      datePublished: '2019-07-19',
      episodeNumber: 16,
      image: 'https://happyhour.fm/media/016.jpg',
      associatedMedia: {
        contentUrl: 'https://happyhour.fm/media/016.mp3',
        duration: 'PT1H',
      },
      partOfSeries: { '@type': 'PodcastSeries', url: 'https://happyhour.fm/' },
    });
  });

  it('escapes < in serialized JSON-LD', () => {
    expect(serializeJsonLd({ name: '</script>' })).toBe(
      '{"name":"\\u003c/script>"}'
    );
  });
});
