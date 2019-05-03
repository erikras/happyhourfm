import React from 'react'
import styled from 'styled-components'
import { Box, Paragraph } from 'grommet'
import { Episode } from '../types'
import { withRouteData } from 'react-static'

type Props = { content?: Episode; episode?: Episode }
export default withRouteData(({ content, episode }: Props) => {
  const ep = episode || content
  if (!ep || !ep.body) return 'no content'
  return (
    <Container fill>
      <Paragraph
        key={ep.frontmatter.slug}
        style={{ maxWidth: '100%', width: '100%' }}
      >
        <div dangerouslySetInnerHTML={{ __html: ep.body }} />
      </Paragraph>
    </Container>
  )
})

const Container = styled(Box)`
  blockquote {
    padding-left: 20px;
    border-left: 2px solid #cc9966;
  }
  li {
    margin: 10px 0;
  }
`
