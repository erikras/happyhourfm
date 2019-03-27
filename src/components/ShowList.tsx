import React from 'react'
import { FMType } from '../types'
import { Anchor, Box, Heading, Paragraph } from 'grommet'
import { CirclePlay } from 'grommet-icons'
import styled from 'styled-components'
import { Location } from '@reach/router'

interface Props {
  frontmatters: FMType[]
  setSelected?: Function
}

const Episode = styled(Anchor)`
  text-decoration: none;
  &:hover {
    text-decoration: none;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  color: black;
  display: block;
`

const EpisodeArt = styled(Box)`
  opacity: 0.8;
  position: relative;
  transition: top 100ms ease-in-out, left 100ms ease-in-out;
  &:hover {
    opacity: 0.9;
    top: -1px;
    left: -1px;
    &:active {
      top: 0;
      left: 0;
    }
  }
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
`

export default function ShowList({ frontmatters }: Props) {
  return (
    <Location>
      {() => {
        return (
          <Box>
            {frontmatters.map(fm => (
              <Episode key={fm.slug} href={fm.slug}>
                <Box
                  key={fm.slug}
                  margin="small"
                  direction="row-responsive"
                  gap="medium"
                >
                  <EpisodeArt
                    direction="column"
                    justify="center"
                    width="200px"
                    height="200px"
                    background={`url(${fm.art})`}
                    align="center"
                  >
                    <CirclePlay size="xlarge" color="white" />
                  </EpisodeArt>
                  <Box flex>
                    <Heading level="3">{fm.title}</Heading>
                    <Box direction="row-responsive" />
                    <Paragraph>{fm.description}</Paragraph>
                  </Box>
                </Box>
              </Episode>
            ))}
          </Box>
        )
      }}
    </Location>
  )
}
