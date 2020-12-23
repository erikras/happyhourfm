import fs from 'fs'
import {Author, buildFeed, FeedOptions, ITunesChannelFields} from 'podcats'
import {url, title, description, defaultImage} from '../util/constants'
import contents from '../util/content'
import {prefixes} from '../util/prefixMp3'
const author: Author = {
  name: 'Erik Rasmussen and Dennis Schrantz',
  email: 'happyhourdotfm@gmail.com',
  link: url,
} as const

const decorateURL = (url) =>
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
    {cat: 'Comedy'},
    {cat: 'News & Politics'},
    {cat: 'Society & Culture', child: 'Philosophy'},
    {cat: 'Society & Culture', child: 'Places & Travel'},
    {cat: 'Sports & Recreation', child: 'TV & Film'},
  ],
  image: defaultImage,
  explicit: true,
  owner: author,
  type: 'episodic',
}

;(async () => {
  try {
    let feed = await buildFeed(
      // prefix show notes in feed with patreon link
      contents.map((content) => {
        return {
          ...content,
          body: `<h3 style="text-align:center;"><a href="https://www.patreon.com/happyhour" rel="payment">Buy a round! Become a Patron!</a></h3>\n${content.body}\n<h3 style="text-align:center;"><a href="https://www.patreon.com/happyhour" rel="payment">Buy a round! Become a Patron!</a></h3>`,
        }
      }),
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
