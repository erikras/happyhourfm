import React from 'react'
import { withSiteData } from 'react-static'
import { Episode, FMType } from '../types'
import { Box } from 'grommet'
import Header from '@src/components/Header'
import Listen from '@src/components/Listen'
import Footer from '@src/components/Footer'
import ShowList from '@src/components/ShowList'

type Props = {
  frontmatters: FMType[]
  mostRecentEpisode: Episode
  title: string
  description: string
  myURL: string
  image: string
}
export default withSiteData(
  ({ frontmatters, title, description, myURL, image }: Props) => {
    return (
      <Box gap="medium">
        <Header
          siteData={{
            title,
            description,
            myURL,
            image,
          }}
        />
        <Box direction="row-responsive" wrap flex="grow">
          <Listen />
          <Box align="center" flex gap="xsmall" pad={{ horizontal: 'medium' }}>
            <Box flex>
              <ShowList frontmatters={frontmatters} />
            </Box>
          </Box>
        </Box>
        <Footer />
      </Box>
    )
  },
)
