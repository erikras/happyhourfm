import React from 'react'
import Head from '../components/Head'
import {Box} from 'grommet'
import Listen from '../components/Listen'
import ShowList from '../components/ShowList'
import Footer from '../components/Footer'
import contents from '../util/content'
import {defaultImage, description, title, url} from '../util/constants'

interface HomeProps {
  frontmatters: string
}

const Home = ({frontmatters}) => (
  <Box gap="medium">
    <Head
      title={title}
      description={description}
      image={defaultImage}
      url={url}
    />
    <Box direction="row-responsive" wrap flex="grow">
      <Listen />
      <Box align="center" flex gap="xsmall" pad={{horizontal: 'medium'}}>
        <Box flex>
          <ShowList frontmatters={JSON.parse(frontmatters)} />
        </Box>
      </Box>
    </Box>
    <Footer />
  </Box>
)

export async function getStaticProps() {
  return {
    props: {
      frontmatters: JSON.stringify(
        contents.map((content) => content.frontmatter)
      ),
    },
  }
}

export default Home
