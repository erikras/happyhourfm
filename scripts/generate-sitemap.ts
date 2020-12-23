import fs from 'fs'
import {url} from '../util/constants'
import contents from '../util/content'
;(async () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <priority>0.5</priority>
  </url>
${contents
  .map(
    (episode) => `  <url>
    <loc>${url}/${episode.frontmatter.slug}</loc>
    <priority>0.5</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
  fs.writeFileSync('public/sitemap.xml', sitemap)
})()
