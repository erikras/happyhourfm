import axios from 'axios'
import path from 'path'
import { mkDir, mkFile } from './fs'
const fs = require('fs')
import { buildFeed, grabContents } from 'podcats'

/// config
const myURL = 'https://happyhour.fm'

const description =
  'A candid and open weekly discussion between Dennis and Erik over drinks'
const image = 'https://happyhour.fm/art.jpg' // TODO: itunes cover and opengraph image. you should customise this!
const ghURL = 'https://github.com/erikras/happyhourfm'
const rss = myURL + '/rss.xml'
const contentFolder = 'content'
const author = {
  name: 'Erik Rasmussen and Dennis Schrantz',
  email: 'happyhourdotfm@gmail.com',
  link: 'https://happyhour.fm',
}
const feedOptions = {
  // blog feed options
  title: 'Happy Hour with Dennis and Erik',
  description,
  link: myURL,
  id: myURL,
  copyright: 'Copyright – Erik Rasmussen and Dennis Schrantz',
  podtrac: true,
  feedLinks: {
    // atom: safeJoin(myURL, 'atom.xml'),
    // json: safeJoin(myURL, 'feed.json'),
    rss: safeJoin(myURL, 'rss.xml'),
  },
  author,
}
const iTunesChannelFields = {
  // itunes options
  summary: 'Happy Hour with Dennis and Erik',
  author: author.name,
  keywords: ['Comedy'],
  categories: [
    { cat: 'Comedy' },
    { cat: 'News & Politics' },
    { cat: 'Society & Culture', child: 'Philosophy' },
    { cat: 'Society & Culture', child: 'Places & Travel' },
    { cat: 'Sports & Recreation', child: 'TV & Film' },
  ],
  image,
  explicit: true,
  owner: author,
  type: 'episodic',
}

// preprocessing'
const filenames = fs.readdirSync(contentFolder).reverse() // reverse chron
const filepaths = filenames.map(file =>
  path.join(process.cwd(), contentFolder, file),
)
const contents = grabContents(filepaths, myURL)
const frontmatters = contents.map(c => c.frontmatter)

// generate HTML
export default {
  plugins: [
    'react-static-plugin-styled-components',
    'react-static-plugin-typescript',
  ],
  entry: path.join(__dirname, 'src', 'index.tsx'),
  siteRoot: myURL,
  getSiteData: async () => {
    // generate RSS
    let feed = await buildFeed(
      contents,
      myURL,
      author,
      feedOptions,
      iTunesChannelFields,
    )
    mkFile('/dist/rss.xml', feed.rss2())

    // const replace = require('replace-in-file')
    // await replace({
    //   files: 'dist/rss.xml',
    //   from: /happyhour\.fm\/media\/001\.mp3/g,
    //   to:
    //     'anchor.fm/s/28c46d0/podcast/play/2712062/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fproduction%2F2019-2-22%2F11711811-44100-2-b79f339062d6b.mp3',
    // })

    return {
      title: 'Happy Hour with Dennis and Erik',
      description,
      rss,
      frontmatters,
      ghURL,
      myURL,
      image,
      mostRecentEpisode: contents[0], // necessary evil to show on '/'
    }
  },
  getRoutes: async () => {
    return [
      {
        path: '/',
        getData: () => ({
          contents,
        }),
        children: contents.map(content => ({
          path: `/${content.frontmatter.slug}`,
          component: 'src/pages/episode',
          getData: () => ({
            content,
            myURL,
          }),
        })),
      },
    ]
  },
}

function safeJoin(a, b) {
  /** strip starting/leading slashes and only use our own */
  let a1 = a.slice(-1) === '/' ? a.slice(0, a.length - 1) : a
  let b1 = b.slice(0) === '/' ? b.slice(1) : b
  return `${a1}/${b1}`
}
