import React from 'react'
import styled from 'styled-components'
import { Episode } from '../types'
import AudioCard from 'audiocard'

type Props = { episode: Episode; image?: string; linkToShowNotes?: boolean }

const Player = ({ episode, image, linkToShowNotes }: Props) => {
  return (
    <Container>
      <AudioCard
        art={
          image || episode.frontmatter.art
            ? `/${episode.frontmatter.art}`
            : undefined
        }
        title={episode.frontmatter.title}
        // source={`https://dts.podtrac.com/redirect.mp3/happyhour.fm/media/${
        //   episode.frontmatter.slug
        // }.mp3`}
        source="/media/002.mp3"
        preload="none"
        link={linkToShowNotes ? `/${episode.frontmatter.slug}` : undefined}
        linkText={linkToShowNotes ? 'Show Notes' : undefined}
      />
    </Container>
  )
}

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
