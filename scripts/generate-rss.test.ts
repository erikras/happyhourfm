import { generateRSS, formatDate, formatDuration } from './generate-rss-custom'

describe('Custom RSS Generator', () => {
  describe('formatDate', () => {
    it('should format valid dates correctly', () => {
      const date = formatDate('2025-06-27T00:00:00.000Z')
      expect(date).toBe('Fri, 27 Jun 2025 00:00:00 GMT')
    })

    it('should throw error for invalid dates', () => {
      expect(() => formatDate('invalid-date')).toThrow('Invalid date: invalid-date')
    })

    it('should handle YYYY-MM-DD format', () => {
      const date = formatDate('2025-06-27')
      expect(date).toMatch(/Fri, 27 Jun 2025 \d{2}:\d{2}:\d{2} GMT/)
    })
  })

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(65)).toBe('01:05')
      expect(formatDuration(125)).toBe('02:05')
    })

    it('should format hours correctly', () => {
      expect(formatDuration(3665)).toBe('01:01:05')
      expect(formatDuration(7325)).toBe('02:02:05')
    })

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('00:00')
    })
  })

  describe('generateRSS', () => {
    const mockFeed = {
      title: 'Test Podcast',
      description: 'A test podcast',
      link: 'https://example.com',
      language: 'en',
      copyright: 'Copyright Test',
      author: 'Test Author',
      image: 'https://example.com/image.jpg',
      explicit: false,
      keywords: ['test'],
      categories: ['Test'],
      episodes: [
        {
          title: 'Episode 1',
          episode: 1,
          date: '2025-06-27T00:00:00.000Z',
          mp3URL: 'media/001.mp3',
          description: 'Test episode',
          body: '<p>Test content</p>',
          duration: 1800,
          explicit: false
        }
      ]
    }

    it('should generate valid RSS XML', () => {
      const rss = generateRSS(mockFeed)

      // Check basic RSS structure
      expect(rss).toContain('<?xml version="1.0" encoding="utf-8"?>')
      expect(rss).toContain('<rss version="2.0"')
      expect(rss).toContain('<channel>')
      expect(rss).toContain('</channel>')
      expect(rss).toContain('</rss>')
    })

    it('should include channel metadata', () => {
      const rss = generateRSS(mockFeed)

      expect(rss).toContain('<title>Test Podcast</title>')
      expect(rss).toContain('<link>https://example.com</link>')
      expect(rss).toContain('<description>A test podcast</description>')
      expect(rss).toContain('<language>en</language>')
      expect(rss).toContain('<copyright>Copyright Test</copyright>')
    })

    it('should include iTunes tags', () => {
      const rss = generateRSS(mockFeed)

      expect(rss).toContain('xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"')
      expect(rss).toContain('<itunes:summary>Test Podcast</itunes:summary>')
      expect(rss).toContain('<itunes:author>Test Author</itunes:author>')
      expect(rss).toContain('<itunes:explicit>no</itunes:explicit>')
      expect(rss).toContain('<itunes:type>episodic</itunes:type>')
    })

    it('should include episode items with proper dates', () => {
      const rss = generateRSS(mockFeed)

      expect(rss).toContain('<item>')
      expect(rss).toContain('<title><![CDATA[Episode 1]]></title>')
      expect(rss).toContain('<pubDate>Fri, 27 Jun 2025 00:00:00 GMT</pubDate>')
      expect(rss).toContain('<itunes:duration>30:00</itunes:duration>')
      expect(rss).toContain('<itunes:episode>1</itunes:episode>')
    })

    it('should escape XML characters', () => {
      const feedWithSpecialChars = {
        ...mockFeed,
        title: 'Test & Podcast <with> "quotes"',
        episodes: [
          {
            ...mockFeed.episodes[0],
            title: 'Episode & Test <with> "quotes"'
          }
        ]
      }

      const rss = generateRSS(feedWithSpecialChars)

      expect(rss).toContain('Test &amp; Podcast &lt;with&gt; &quot;quotes&quot;')
      expect(rss).toContain('Episode &amp; Test &lt;with&gt; &quot;quotes&quot;')
    })

    it('should handle multiple episodes', () => {
      const multiEpisodeFeed = {
        ...mockFeed,
        episodes: [
          {
            title: 'Episode 1',
            episode: 1,
            date: '2025-06-27T00:00:00.000Z',
            mp3URL: 'media/001.mp3',
            description: 'First episode',
            body: '<p>First content</p>',
            duration: 1800,
            explicit: false
          },
          {
            title: 'Episode 2',
            episode: 2,
            date: '2025-06-28T00:00:00.000Z',
            mp3URL: 'media/002.mp3',
            description: 'Second episode',
            body: '<p>Second content</p>',
            duration: 2400,
            explicit: false
          }
        ]
      }

      const rss = generateRSS(multiEpisodeFeed)

      expect(rss).toContain('Episode 1')
      expect(rss).toContain('Episode 2')
      expect(rss).toContain('Fri, 27 Jun 2025 00:00:00 GMT')
      expect(rss).toContain('Sat, 28 Jun 2025 00:00:00 GMT')
      expect(rss).toContain('30:00')
      expect(rss).toContain('40:00')
    })
  })
}) 