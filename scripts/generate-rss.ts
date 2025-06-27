import fs from 'fs'
import { Author, buildFeed, FeedOptions, ITunesChannelFields } from 'podcats'
import { defaultImage, description, title, url } from '../util/constants'
import contents from '../util/content'
import { prefixes } from '../util/prefixMp3'
const author: Author = {
  name: 'Erik Rasmussen and Dennis Schrantz',
  email: 'happyhourdotfm@gmail.com',
  link: url,
} as const

const decorateURL = (url: string) =>
  `https://${prefixes.reduce(
    (result, prefix) => `${prefix}${result}`,
    url.substring(8) // remove https://
  )}`

const feedOptions: FeedOptions = {
  // blog feed options
  title,
  description,
  link: url,
  id: url,
  copyright: 'Copyright – Erik Rasmussen and Dennis Schrantz',
  decorateURL,
  feedLinks: {
    rss: safeJoin(url, 'rss.xml'),
  },
  author,
} as const

const iTunesChannelFields: ITunesChannelFields = {
  // itunes options
  summary: title,
  author: author.name,
  keywords: ['Comedy'],
  categories: [
    { cat: 'Comedy' },
    { cat: 'News & Politics' },
    { cat: 'Society & Culture', child: 'Philosophy' },
    { cat: 'Society & Culture', child: 'Places & Travel' },
    { cat: 'Sports & Recreation', child: 'TV & Film' },
  ],
  image: defaultImage,
  explicit: true,
  owner: author,
  type: 'episodic',
}

  ; (async () => {
    try {
      const normalizedContents = contents.map((content) => {
        // Normalize date to string (YYYY-MM-DD)
        let date = content.frontmatter.date
        if (Object.prototype.toString.call(date) === '[object Date]') {
          date = (date as unknown as Date).toISOString()
        } else if (typeof date === 'number') {
          date = new Date(date).toISOString()
        } else if (typeof date === 'string') {
          // If it's just YYYY-MM-DD, add T00:00:00Z
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            date = date + 'T00:00:00Z'
          }
        } else {
          date = ''
        }
        return {
          ...content,
          frontmatter: {
            ...content.frontmatter,
            date,
          },
          body: `<h3 style="text-align:center;"><a href="https://www.patreon.com/happyhour" rel="payment">Buy a round! Become a Patron!</a></h3>\n${chopBeforeSummary(content.body)}\n<h3 style="text-align:center;"><a href="https://www.patreon.com/happyhour" rel="payment">Buy a round! Become a Patron!</a></h3>`,
        }
      })
      console.log('Episode dates:', normalizedContents.map(c => c.frontmatter.date))
      let feed = await buildFeed(
        normalizedContents,
        url,
        author,
        feedOptions,
        iTunesChannelFields
      )

      fs.writeFileSync('public/rss.xml', feed.rss2())
    } catch (error) {
      console.error(error)
    }
  })()

function safeJoin(a: string, b: string) {
  /** strip starting/leading slashes and only use our own */
  let a1 = a.slice(-1) === '/' ? a.slice(0, a.length - 1) : a
  let b1 = b.slice(0) === '/' ? b.slice(1) : b
  return `${a1}/${b1}`
}

function chopBeforeSummary(body: string) {
  const indexOfSummary = body.indexOf('\n<h2>Summary</h2>')
  return indexOfSummary === -1 ? body : body.slice(0, indexOfSummary)
}