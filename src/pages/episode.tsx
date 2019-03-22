import React from 'react'

import { withSiteData, withRouteData } from 'react-static'
import { Episode, FMType } from '../types'
import { Box, Image } from 'grommet'
import Header from '@src/components/Header'
import Player from '@src/components/Player'
import Footer from '@src/components/Footer'
import Listen from '@src/components/Listen'
import DownloadBar from '@src/components/DownloadBar'
import ShowNotes from '@src/components/ShowNotes'
import styled from 'styled-components'

const Main = styled('main')`
  background: #fff;
  display: flex;
  flex-wrap: wrap;
`

type Props = {
  frontmatters: FMType[]
  content: Episode
  title: string
  description: string
  myURL: string
  image: string
}
export default withSiteData(
  withRouteData(
    ({ content: episode, myURL, image, title, description }: Props) => {
      return episode ? (
        <Box gap="medium">
          <Header
            content={episode}
            siteData={{
              title,
              description,
              myURL: `${myURL}/${episode.frontmatter.slug}`,
              image: `${myURL}/${episode.frontmatter.art}` || image,
            }}
          />

          <Box direction="row-responsive" wrap flex="grow">
            <Listen />
            <Box
              align="center"
              flex
              gap="xsmall"
              pad={{ horizontal: 'medium' }}
            >
              <DownloadBar />
              <Player episode={episode} />
              <Box
                elevation="large"
                width="300px"
                height="300px"
                flex="grow"
                margin={{ top: 'medium' }}
              >
                <Image
                  src={`/${episode.frontmatter.art}`}
                  alt="Episode Art"
                  fit="contain"
                />
              </Box>
              <ShowNotes episode={episode} />
            </Box>
          </Box>
          <Footer />
        </Box>
      ) : null
    },
  ),
)
