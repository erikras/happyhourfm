import fs from 'fs'
import path from 'path'
import frontMatter from 'front-matter'
import MarkdownIt from 'markdown-it'
import { url } from './constants'

const contentFolder = 'content'
const md = new MarkdownIt()

interface FrontMatter {
  title: string
  mp3URL: string
  download?: string
  date: string
  art?: string
  description: string
  episodeType?: 'full' | 'trailer' | 'bonus'
  episode?: number
  season?: number
  slug?: string
  youtube?: string
}

interface Content {
  frontmatter: FrontMatter
  body: string
  filepath: string
}

function grabContents(filepaths: string[], baseUrl: string): Content[] {
  const contents: Content[] = []

  for (const filepath of filepaths) {
    try {
      const content = fs.readFileSync(filepath, 'utf-8')
      const { attributes, body } = frontMatter<FrontMatter>(content)

      // Generate slug from filename
      const slug = path.basename(filepath, '.md')

      // Convert body to HTML
      const htmlBody = md.render(body)

      contents.push({
        frontmatter: {
          ...attributes,
          slug,
        },
        body: htmlBody,
        filepath,
      })
    } catch (error) {
      console.warn(`Error processing ${filepath}:`, error)
    }
  }

  return contents
}

const filenames = fs.readdirSync(contentFolder).reverse() // reverse chron
const filepaths = filenames.map((file) =>
  path.join(process.cwd(), contentFolder, file)
)

const contents = grabContents(filepaths, url)

contents.sort((a, b) => (b.frontmatter.episode ?? 0) - (a.frontmatter.episode ?? 0))

export default contents
