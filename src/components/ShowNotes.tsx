import React from 'react'
import { Box, Heading, Paragraph } from 'grommet'
import { Episode } from '../types'
import { withRouteData } from 'react-static'
import styled from 'styled-components'
import console = require('console')
const Container = styled('div')`
  width: 62%;
  font-size: 1.25rem;
  padding: 2rem;
  h2 {
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 1rem;
    margin-bottom: 0;
  }
  @media (max-width: 650px) {
    width: 100%;
  }
  li {
    margin: 10px;
  }
`
type Props = { content?: Episode; episode?: Episode }
export default withRouteData(({ content, episode }: Props) => {
  const ep = episode || content
  console.info({ episode, content })
  if (!ep) return 'no content'
  return (
    <Box fill>
      <Paragraph dangerouslySetInnerHTML={{ __html: ep.body }} />
    </Box>
  )
})
