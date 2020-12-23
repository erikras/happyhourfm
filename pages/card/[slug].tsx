import React from 'react'
import Head from '../../components/Head'
import {Box, Grommet} from 'grommet'
import contents from '../../util/content'
import {GetStaticPaths, GetStaticProps} from 'next'
import Player from '../../components/Player'
import {url} from '../../util/constants'
import {createGlobalStyle} from 'styled-components'
import {theme} from '../_app'
import {Ep} from '../[episode]'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
  }
  blockquote {
    border-left: 2px solid #cc9966;
  }
`

interface CardProps {
  episode: string
}

export default function Card({episode}: CardProps) {
  const ep: Ep = JSON.parse(episode)
  const img = ep.frontmatter.art
    ? `${url}/${ep.frontmatter.art}`
    : '/art300.jpg'
  return (
    <Grommet theme={theme}>
      <GlobalStyle />
      <Head
        noContent
        content={ep}
        title={ep.frontmatter.title}
        description={ep.frontmatter.description}
        url={`${url}/${ep.frontmatter.slug}`}
        image={img}
      />
      <Player episode={ep} image={img} linkToShowNotes autoPlay />
    </Grommet>
  )
}

export const getStaticProps: GetStaticProps = async ({params: {slug}}) => {
  return {
    props: {
      episode: JSON.stringify(
        contents.find((content) => content.frontmatter.slug === slug)
      ),
      noWrap: true,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: contents.map((content) => ({
    params: {slug: content.frontmatter.slug},
  })),
  fallback: false,
})
