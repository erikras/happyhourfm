import fs from 'fs'
import path from 'path'
import {grabContents} from 'podcats'
import {url} from './constants'

const contentFolder = 'content'

const filenames = fs.readdirSync(contentFolder).reverse() // reverse chron
const filepaths = filenames.map((file) =>
  path.join(process.cwd(), contentFolder, file)
)

const contents = grabContents(filepaths, url)

contents.sort((a, b) => b.frontmatter.episode - a.frontmatter.episode)

export default contents
