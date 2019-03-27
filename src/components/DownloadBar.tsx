import React from 'react'
import { Anchor, Box, Paragraph } from 'grommet'
import { Download, Edit } from 'grommet-icons'
import { Episode } from '../types'
import { withSiteData, withRouteData } from 'react-static'

export type DownloadBarProps = { content: Episode; ghURL: string }
export const DownloadBar: React.FC<DownloadBarProps> = ({
  content: { frontmatter },
  ghURL,
}) => {
  return (
    <Box
      direction="row-responsive"
      justify="around"
      fill="horizontal"
      flex="grow"
    >
      <Paragraph>
        <Anchor
          download=""
          href={`https://dts.podtrac.com/redirect.mp3/happyhour.fm/media/${
            frontmatter.slug
          }.mp3`}
        >
          <Download alignmentBaseline="middle" /> Download Episode
        </Anchor>
      </Paragraph>
      <Paragraph style={{ lineHeight: '30px' }}>
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

export default withSiteData(withRouteData(DownloadBar))
