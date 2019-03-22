import React from 'react'
import styled from 'styled-components'
import { Anchor, Box, Paragraph } from 'grommet'
import { Calendar, Download, Edit } from 'grommet-icons'
import { Episode } from '../types'
import { withSiteData, withRouteData } from 'react-static'

const StyledDiv = styled('div')`
  display: flex;
  font-size: 0.8rem;
  justify-content: space-between;
  @media (max-width: 650px) {
    flex-direction: column-reverse;
  }
  .button {
    border: 0;
    background: #f9f9f9;
    color: #1d1d1d;
    line-height: 1;
    padding: 1rem;
    display: inline-block;
    transition: all 0.2s;
  }
  .icon {
    border-right: 1px solid #e4e4e4;
    padding-right: 0.5rem;
    margin-right: 0.5rem;
  }
  #date {
    margin-top: 0;
    text-align: right;
    color: #666;
    font-size: 1.2rem;
  }
`
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
      <Paragraph>{new Date(frontmatter.date).toLocaleDateString()}</Paragraph>
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
