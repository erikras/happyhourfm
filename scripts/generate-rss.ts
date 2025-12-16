import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { defaultImage, description, title, url } from '../util/constants'
import contents from '../util/content'
import { prefixMp3 } from '../util/prefixMp3'

// Import author values from the original script
const author = {
  name: 'Erik Rasmussen and Dennis Schrantz',
  email: 'happyhourdotfm@gmail.com',
  link: url,
} as const

interface Episode {
  title: string
  episode: number
  date: string
  mp3URL: string
  art?: string
  description: string
  body: string
  duration: number
  explicit?: boolean
  episodeType?: 'full' | 'trailer' | 'bonus'
  season?: number
  slug: string
}

interface RSSFeed {
  title: string
  description: string
  link: string
  language: string
  copyright: string
  author: string
  image: string
  explicit: boolean
  keywords: string[]
  categories: string[]
  episodes: Episode[]
}

const PODCAST_NAMESPACE = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6'
const canonicalFeedUrl = 'https://www.happyhour.fm/rss.xml'

const decorateURL = (mp3Path: string) => {
  // Extract just the filename from the path (e.g., "media/264.mp3" -> "264.mp3")
  const filename = path.basename(mp3Path)
  return prefixMp3(filename)
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`)
  }
  return date.toUTCString()
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function toAbsoluteUrl(relativeOrAbsolute: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(relativeOrAbsolute)) {
    return relativeOrAbsolute
  }
  return `${baseUrl.replace(/\/$/, '')}/${relativeOrAbsolute.replace(/^\//, '')}`
}

function uuidToBytes(uuid: string): Buffer {
  const hex = uuid.replace(/-/g, '')
  return Buffer.from(hex, 'hex')
}

function bytesToUuid(buffer: Buffer): string {
  const hex = buffer.toString('hex')
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-')
}

function uuidV5(name: string, namespace: string): string {
  const namespaceBytes = uuidToBytes(namespace)
  const nameBytes = Buffer.from(name, 'utf8')
  const hash = crypto.createHash('sha1').update(Buffer.concat([namespaceBytes, nameBytes])).digest()

  hash[6] = (hash[6] & 0x0f) | 0x50
  hash[8] = (hash[8] & 0x3f) | 0x80

  return bytesToUuid(hash.subarray(0, 16))
}

function getMp3Duration(mp3Path: string): Promise<number> {
  return new Promise((resolve) => {
    try {
      const mp3Duration = require('mp3-duration')
      mp3Duration(mp3Path, (err: any, duration: number) => {
        if (err) {
          console.warn(`Could not get duration for ${mp3Path}:`, err.message)
          resolve(0)
        } else {
          resolve(duration || 0)
        }
      })
    } catch (error) {
      console.warn(`mp3-duration not available, using 0 for ${mp3Path}`)
      resolve(0)
    }
  })
}

function getMp3Size(mp3Path: string): number {
  try {
    return fs.statSync(mp3Path).size
  } catch (error) {
    console.warn(`Could not get size for ${mp3Path}`)
    return 0
  }
}

function generateRSS(feed: RSSFeed): string {
  const now = new Date().toUTCString()
  const feedGuid = uuidV5(canonicalFeedUrl, PODCAST_NAMESPACE)

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:podcast="https://podcastindex.org/namespace/1.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <atom:link href="${escapeXml(canonicalFeedUrl)}" rel="self" type="application/rss+xml"/>
        <title>${escapeXml(feed.title)}</title>
        <link>${escapeXml(feed.link)}</link>
        <language>${feed.language}</language>
        <description>${escapeXml(feed.description)}</description>
        <managingEditor>${author.email} (${escapeXml(feed.author)})</managingEditor>
        <pubDate>${now}</pubDate>
        <lastBuildDate>${now}</lastBuildDate>
        <docs>${escapeXml(feed.link)}</docs>
        <generator>Custom RSS Generator</generator>
        <itunes:summary>${escapeXml(feed.description)}</itunes:summary>
        <itunes:author>${escapeXml(feed.author)}</itunes:author>
        <itunes:keywords>${feed.keywords.join(', ')}</itunes:keywords>
        <itunes:category text="Comedy">
            <itunes:category text="Comedy Interviews"/>
        </itunes:category>
        <itunes:category text="News">
            <itunes:category text="News Commentary"/>
        </itunes:category>
        <itunes:category text="Society &amp; Culture">
            <itunes:category text="Philosophy"/>
        </itunes:category>
        <itunes:image href="${escapeXml(feed.image)}"/>
        <itunes:explicit>${feed.explicit ? 'true' : 'false'}</itunes:explicit>
        <itunes:owner>
            <itunes:name><![CDATA[${feed.author}]]></itunes:name>
            <itunes:email>${author.email}</itunes:email>
        </itunes:owner>
        <itunes:type>episodic</itunes:type>
        <podcast:guid>${feedGuid}</podcast:guid>
        <podcast:locked>yes</podcast:locked>
        <copyright>${escapeXml(feed.copyright)}</copyright>`

  // Add episodes
  feed.episodes.forEach(episode => {
    const decoratedMp3URL = decorateURL(episode.mp3URL)
    const mp3Path = path.join(process.cwd(), 'public', episode.mp3URL)
    const enclosureLength = getMp3Size(mp3Path)
    const episodeArtUrl = episode.art
      ? toAbsoluteUrl(episode.art, feed.link)
      : feed.image
    const episodeDurationSeconds =
      Number.isFinite(episode.duration) && episode.duration > 0
        ? Math.round(episode.duration)
        : 0

    // Create episode page URL (webpage, not audio file)
    const episodePageURL = `${feed.link}/${episode.slug}`

    // Create unique GUID using episode number and URL
    const uniqueGuid = `${feed.link}/episode/${episode.episode}`

    // Use channel explicit setting if episode doesn't have one set
    const episodeExplicit = episode.explicit !== undefined ? episode.explicit : feed.explicit

    rss += `
        <item>
            <title><![CDATA[${episode.title}]]></title>
            <link><![CDATA[${episodePageURL}]]></link>
            <guid isPermaLink="false">${uniqueGuid}</guid>
            <pubDate>${formatDate(episode.date)}</pubDate>
            <description><![CDATA[${episode.body}]]></description>
            <content:encoded><![CDATA[${episode.body}]]></content:encoded>
            <author>${author.email} (${escapeXml(feed.author)})</author>
            <enclosure length="${enclosureLength}" type="audio/mpeg" url="${decoratedMp3URL}"/>
            <itunes:image href="${escapeXml(episodeArtUrl)}"/>
            <itunes:duration>${episodeDurationSeconds}</itunes:duration>
            <itunes:explicit>${episodeExplicit ? 'true' : 'false'}</itunes:explicit>
            <itunes:subtitle><![CDATA[${episode.description}]]></itunes:subtitle>
            <itunes:summary><![CDATA[${episode.description}]]></itunes:summary>
            <itunes:author>${escapeXml(feed.author)}</itunes:author>
            <itunes:episodeType>${episode.episodeType ?? 'full'}</itunes:episodeType>
            <itunes:episode>${episode.episode}</itunes:episode>
            <podcast:transcript url="${escapeXml(episodePageURL)}" type="text/html"/>`

    if (episode.season) {
      rss += `
        <itunes:season>${episode.season}</itunes:season>`
    }

    rss += `
        </item>`
  })

  rss += `
    </channel>
</rss>`

  return rss
}

async function generateRSSFeed(): Promise<void> {
  try {
    console.log('Generating RSS feed...')

    // Process episodes
    const episodes: Episode[] = []

    for (const content of contents) {
      // Handle optional episode number
      const episodeNumber = content.frontmatter.episode ?? 0
      // Get slug from frontmatter (already added by content.ts)
      const slug = content.frontmatter.slug || path.basename(content.filepath, '.md')

      const episode: Episode = {
        title: content.frontmatter.title,
        episode: episodeNumber,
        date: content.frontmatter.date,
        mp3URL: content.frontmatter.mp3URL,
        art: content.frontmatter.art,
        description: content.frontmatter.description,
        body: `<h3 style="text-align:center;"><a href="https://www.patreon.com/happyhour" rel="payment">Buy a round! Become a Patron!</a></h3>\n${chopBeforeSummary(content.body)}\n<h3 style="text-align:center;"><a href="https://www.patreon.com/happyhour" rel="payment">Buy a round! Become a Patron!</a></h3>`,
        duration: 0,
        explicit: true, // Match channel explicit setting
        episodeType: content.frontmatter.episodeType,
        season: content.frontmatter.season,
        slug
      }

      // Get MP3 duration
      const mp3Path = path.join(process.cwd(), 'public', content.frontmatter.mp3URL)
      const duration = await getMp3Duration(mp3Path)
      episode.duration = duration

      episodes.push(episode)
    }

    // Sort episodes by episode number (newest first)
    episodes.sort((a, b) => b.episode - a.episode)

    const feed: RSSFeed = {
      title,
      description,
      link: url,
      language: 'en-us',
      copyright: 'Erik Rasmussen and Dennis Schrantz',
      author: author.name,
      image: defaultImage,
      explicit: true,
      keywords: ['Comedy'],
      categories: ['Comedy', 'News & Politics', 'Society & Culture'],
      episodes
    }

    const rssContent = generateRSS(feed)
    fs.writeFileSync('public/rss.xml', rssContent)

    console.log(`RSS feed generated with ${episodes.length} episodes`)
    console.log('Episode dates:', episodes.map(e => `${e.episode}: ${formatDate(e.date)}`))

  } catch (error) {
    console.error('Error generating RSS feed:', error)
    throw error
  }
}

function chopBeforeSummary(body: string): string {
  const indexOfSummary = body.indexOf('\n<h2>Summary</h2>')
  return indexOfSummary === -1 ? body : body.slice(0, indexOfSummary)
}

// Run if called directly
if (require.main === module) {
  generateRSSFeed().catch(console.error)
}

export { generateRSSFeed, generateRSS, formatDate, formatDuration } 