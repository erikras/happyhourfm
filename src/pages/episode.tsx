import React from 'react'

import { withSiteData, withRouteData } from 'react-static'
import { Episode, FMType } from '../types'
import Page from '@src/Page'
import { Box } from 'grommet'
import Header from '@src/components/Header'
import Player from '@src/components/Player'
import Footer from '@src/components/Footer'
import Listen from '@src/components/Listen'
import DownloadBar from '@src/components/DownloadBar'
import ShowNotes from '@src/components/ShowNotes'

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
        <Page>
          <Box gap="medium">
            <Header
              content={episode}
              siteData={{
                title,
                description,
                myURL: `${myURL}/${episode.frontmatter.slug}`,
                image: episode.frontmatter.art
                  ? `${myURL}/${episode.frontmatter.art}`
                  : image,
              }}
              twitterCard={`${myURL}/card/${episode.frontmatter.slug}`}
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
                <Player episode={episode} linkToShowNotes />
                <ShowNotes episode={episode} />
              </Box>
            </Box>
            <Footer />
          </Box>
        </Page>
      ) : null
    },
  ),
)
