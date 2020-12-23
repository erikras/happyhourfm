import React from 'react'
import {Anchor, Box, Paragraph} from 'grommet'
import {Download, Edit} from 'grommet-icons'
import {ghURL} from '../util/constants'
import {prefixMp3} from '../util/prefixMp3'
import {EpisodeFrontMatter} from 'podcats'

export type DownloadBarProps = {frontmatter: EpisodeFrontMatter}
export const DownloadBar: React.FC<DownloadBarProps> = ({frontmatter}) => {
  return (
    <Box
      direction="row-responsive"
      justify="around"
      fill="horizontal"
      flex="grow"
    >
      <Paragraph>
        <Anchor download="" href={prefixMp3(`${frontmatter.slug}.mp3`)}>
          <Download alignmentBaseline="middle" /> Download Episode
        </Anchor>
      </Paragraph>
      <Paragraph style={{lineHeight: '30px'}}>
        {new Date(frontmatter.date).toLocaleDateString()}
      </Paragraph>
      <Paragraph>
        <Anchor
          href={`${ghURL}/edit/master/content/${frontmatter.slug}.md`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Edit alignmentBaseline="middle" /> Edit Show Notes
        </Anchor>
      </Paragraph>
    </Box>
  )
}

export default DownloadBar
