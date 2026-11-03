import fs from 'node:fs';
import contents from '../util/content';
import { episodeUrl, siteUrl, toIsoDate } from '../util/seo';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

function buildSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function getSitemapEntries(): SitemapEntry[] {
  const episodes = contents
    .filter((content) => content.frontmatter.slug)
    .map((content) => ({
      loc: episodeUrl(content.frontmatter.slug as string),
      lastmod: toIsoDate(content.frontmatter.date),
    }));

  // contents is sorted newest first, so the home page changes with it
  return [{ loc: siteUrl, lastmod: episodes[0]?.lastmod }, ...episodes];
}

if (require.main === module) {
  const entries = getSitemapEntries();
  fs.writeFileSync('public/sitemap.xml', buildSitemap(entries));
  console.log(`Sitemap generated with ${entries.length} URLs`);
}

export { buildSitemap, getSitemapEntries };
