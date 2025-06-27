import fs from 'fs'
import path from 'path'
import { grabContents } from 'podcats'
import { url } from '../util/constants'

const contentFolder = 'content'

export interface Episode {
  frontmatter: {
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
  body: string
  mp3path?: string
  filepath?: string
}

export async function getEpisodes(): Promise<{ episodes: Episode[], totalEpisodes: number }> {
  const filenames = fs.readdirSync(contentFolder)
  const filepaths = filenames.map((file) =>
    path.join(process.cwd(), contentFolder, file)
  )

  const contents = grabContents(filepaths, url) as any[]

  // Ensure dates are strings and add slug from filename
  const episodes: Episode[] = contents.map((content, idx) => {
    // Get the filename from the filepath property if available, else fallback to filenames[idx]
    let slug = ''
    if (content.filepath) {
      slug = path.basename(content.filepath, '.md')
    } else if (filepaths[idx]) {
      slug = path.basename(filepaths[idx], '.md')
    }
    return {
      ...content,
      frontmatter: {
        ...content.frontmatter,
        slug,
        date: typeof content.frontmatter.date === 'string'
          ? content.frontmatter.date
          : new Date(content.frontmatter.date).toISOString().split('T')[0]
      }
    }
  })

  episodes.sort((a, b) => (b.frontmatter.episode || 0) - (a.frontmatter.episode || 0))

  return {
    episodes,
    totalEpisodes: episodes.length
  }
}

export async function getEpisode(slug: string): Promise<Episode | null> {
  const { episodes } = await getEpisodes()
  return episodes.find(ep => ep.frontmatter.slug === slug) || null
}

export async function getAllEpisodeSlugs(): Promise<string[]> {
  const { episodes } = await getEpisodes()
  return episodes.map(ep => ep.frontmatter.slug).filter(Boolean) as string[]
}

export async function getNextEpisode(currentSlug: string): Promise<Episode | null> {
  const { episodes } = await getEpisodes()
  const currentIndex = episodes.findIndex(ep => ep.frontmatter.slug === currentSlug)

  if (currentIndex === -1 || currentIndex === 0) {
    return null
  }

  return episodes[currentIndex - 1]
}

export async function getPreviousEpisode(currentSlug: string): Promise<Episode | null> {
  const { episodes } = await getEpisodes()
  const currentIndex = episodes.findIndex(ep => ep.frontmatter.slug === currentSlug)

  if (currentIndex === -1 || currentIndex === episodes.length - 1) {
    return null
  }

  return episodes[currentIndex + 1]
} 