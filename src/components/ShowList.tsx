import React from 'react'
import { FMType } from '../types'
import { Link } from '@reach/router'
import { Anchor, Box, Heading, Image, Paragraph } from 'grommet'
import { CirclePlay } from 'grommet-icons'
import styled from 'styled-components'
import { Location } from '@reach/router'

interface Item {
  frontmatter: FMType
  isActive: boolean
}

interface Props {
  frontmatters: FMType[]
  setSelected?: Function
}

const Episode = styled(Anchor)`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
  color: black;
  display: block;
`

const EpisodeArt = styled(Box)`
  opacity: 0.8;
  &:hover {
    opacity: 0.9;
  }
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
`

export default function ShowList({ frontmatters }: Props) {
  return (
    <Location>
      {props => {
        let activeEpisodeSlug = frontmatters[0].slug
        if (props.location.pathname !== '/') {
          activeEpisodeSlug = props.location.pathname.split('/').slice(-1)[0] // just grab the slug at the end. pretty brittle but ok
        }
        console.log('propslocation', props.location.pathname)
        return (
          <Box>
            {frontmatters.map(fm => (
              <Episode href={fm.slug}>
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
