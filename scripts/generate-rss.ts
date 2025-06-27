import fs from 'fs'
import path from 'path'
import { defaultImage, description, title, url } from '../util/constants'
import contents from '../util/content'
import { prefixes } from '../util/prefixMp3'

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
  description: string
  body: string
  duration: number
  explicit?: boolean
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

const decorateURL = (url: string) =>
  `https://${prefixes.reduce(
    (result, prefix) => `${prefix}${result}`,
    url.substring(8) // remove https://
  )}`

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

  let rss = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:media="http://search.yahoo.com/mrss/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <channel>
        <title>${escapeXml(feed.title)}</title>
        <link>${escapeXml(feed.link)}</link>
        <language>${feed.language}</language>
        <description>${escapeXml(feed.description)}</description>
        <managingEditor>${feed.author} (${feed.author})</managingEditor>
        <pubDate>${now}</pubDate>
        <lastBuildDate>${now}</lastBuildDate>
        <docs>${escapeXml(feed.link)}</docs>
        <generator>Custom RSS Generator</generator>
        <itunes:summary>${escapeXml(feed.title)}</itunes:summary>
        <itunes:author>${escapeXml(feed.author)}</itunes:author>
        <itunes:keywords>${feed.keywords.join(',')}</itunes:keywords>
        <itunes:category text="Comedy"/>
        <itunes:category text="News &amp; Politics"/>
        <itunes:category text="Society &amp; Culture">
            <itunes:category text="Philosophy"/>
        </itunes:category>
        <itunes:category text="Society &amp; Culture">
            <itunes:category text="Places &amp; Travel"/>
        </itunes:category>
        <itunes:category text="Sports &amp; Recreation">
            <itunes:category text="TV &amp; Film"/>
        </itunes:category>
        <itunes:image href="${escapeXml(feed.image)}"/>
        <itunes:explicit>${feed.explicit ? 'yes' : 'no'}</itunes:explicit>
        <itunes:owner>
            <itunes:name><![CDATA[${feed.author}]]></itunes:name>
            <itunes:email>${author.email}</itunes:email>
        </itunes:owner>
        <itunes:type>episodic</itunes:type>
        <copyright>${escapeXml(feed.copyright)}</copyright>`

  // Add episodes
  feed.episodes.forEach(episode => {
    const decoratedMp3URL = decorateURL(episode.mp3URL)
    const mp3Path = path.join(process.cwd(), 'public', episode.mp3URL)
    const enclosureLength = getMp3Size(mp3Path)

    rss += `
        <item>
            <title><![CDATA[${episode.title}]]></title>
            <link><![CDATA[${decoratedMp3URL}]]></link>
            <guid>${decoratedMp3URL}</guid>
            <pubDate>${formatDate(episode.date)}</pubDate>
            <description><![CDATA[${episode.body}]]></description>
            <content:encoded><![CDATA[${episode.body}]]></content:encoded>
            <author>${author.email} (${escapeXml(feed.author)})</author>
            <enclosure length="${enclosureLength}" type="audio/mpeg" url="${decoratedMp3URL}"/>
            <itunes:duration>${episode.duration ? formatDuration(episode.duration) : '00:00'}</itunes:duration>
            <itunes:explicit>${episode.explicit ? 'yes' : 'no'}</itunes:explicit>
            <itunes:subtitle><![CDATA[${episode.description}]]></itunes:subtitle>
            <itunes:episodeType>full</itunes:episodeType>
            <itunes:episode>${episode.episode}</itunes:episode>
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

      const episode: Episode = {
        title: content.frontmatter.title,
        episode: episodeNumber,
        date: content.frontmatter.date,
        mp3URL: content.frontmatter.mp3URL,
        description: content.frontmatter.description,
        body: `<h3 style="text-align:center;"><a href="https://www.patreon.com/happyhour" rel="payment">Buy a round! Become a Patron!</a></h3>\n${chopBeforeSummary(content.body)}\n<h3 style="text-align:center;"><a href="https://www.patreon.com/happyhour" rel="payment">Buy a round! Become a Patron!</a></h3>`,
        duration: 0,
        explicit: false
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
      language: 'en',
      copyright: 'Copyright – Erik Rasmussen and Dennis Schrantz',
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