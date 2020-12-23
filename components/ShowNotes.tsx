import React from 'react'
import styled from 'styled-components'
import {Box, Paragraph} from 'grommet'
import {Ep} from '../pages/[episode]'

type Props = {episode: Ep}
export default function ShowNotes({episode}: Props) {
  if (!episode || !episode.body) return <>no content</>
  return (
    <Container fill>
      <Paragraph
        key={episode.frontmatter.slug}
        style={{maxWidth: '100%', width: '100%'}}
      >
        <div dangerouslySetInnerHTML={{__html: episode.body}} />
      </Paragraph>
    </Container>
  )
}

const Container = styled(Box)`
  blockquote {
    padding-left: 20px;
    border-left: 2px solid #cc9966;
  }
  li {
    margin: 10px 0;
  }
`
