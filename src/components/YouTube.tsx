import React from 'react'
import styled from 'styled-components'

type Props = {
  id: string
}

const Player = ({ id }: Props) => {
  return (
    <Container>
      <Stretchy>
        <Embed
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder={0}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      </Stretchy>
    </Container>
  )
}

const Container = styled.div`
  max-width: 500px;
  width: 100%;
  display: block;
  margin: 0 auto;
`

const Stretchy = styled.div`
  width: 100%;
  padding-bottom: 100%; /* square */
  position: relative;
`

const Embed = styled.iframe`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
`

export default Player
