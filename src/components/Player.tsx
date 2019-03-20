import React from 'react'
import styled from 'styled-components'
import { Episode } from '../types'
import { MediaPlayer } from '@cassette/player'

type Props = { episode: Episode }

const Player = ({ episode }: Props) => (
  <Container>
    <MediaPlayer
      playlist={[
        {
          url: `/${episode.frontmatter.mp3URL}`,
          title: episode.frontmatter.title,
        },
      ]}
      controls={['playpause', 'volume', 'spacer', 'progress']}
      style={{ width: '100%' }}
    />
  </Container>
)

const Container = styled.div`
  width: 100%;
  & > div {
    display: flex;
    flex-flow: row;
    & > .cassette {
      flex: 1;
    }
  }
`
export default Player
