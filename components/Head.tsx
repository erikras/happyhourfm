import React from 'react'
import NextHead from 'next/head'
import {Anchor, Box, Heading, Image} from 'grommet'
import {Episode} from 'podcats'
import {Favicon} from './Favicon'
import styled from 'styled-components'
import {prefixMp3} from '../util/prefixMp3'
import Share from './Share'

interface HeadProps {
  content?: Episode
  noContent?: boolean
  title: string
  description: string
  url: string
  image: string
  twitterCard?: string
}

export default function Head({
  content,
  title,
  description,
  url,
  image,
  noContent,
  twitterCard,
}: HeadProps) {
  const titleHead =
    content && content.frontmatter.episode ? content.frontmatter.title : title
  const desc = content ? content.frontmatter.description : description
  const cardMeta = twitterCard
    ? [
        <meta key="card" name="twitter:card" content="player" />,
        <meta key="player" name="twitter:player" content={twitterCard} />,
        <meta key="width" name="twitter:player:width" content="800" />,
        <meta key="height" name="twitter:player:height" content="240" />,
        <meta
          name="twitter:player:stream"
          key="stream"
          content={prefixMp3(`${content?.frontmatter.slug}.mp3`)}
        />,
        <meta
          key="content_type"
          name="twitter:player:stream:content_type"
          content="audio/mpeg"
        />,
      ]
    : []
  return (
    <>
      <NextHead>
        <meta charSet="utf-8" />
        <title>{titleHead}</title>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-137049034-1"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-T7KGN2M"
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={titleHead} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={title} />
        <meta name="twitter:title" content={titleHead} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@happyhourdotfm" />
        <meta name="twitter:creator" content="@happyhourdotfm" />
        {cardMeta}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
        <Favicon rel="apple-touch-icon" size="57x57" />
        <Favicon rel="apple-touch-icon" size="60x60" />
        <Favicon rel="apple-touch-icon" size="72x72" />
        <Favicon rel="apple-touch-icon" size="76x76" />
        <Favicon rel="apple-touch-icon" size="114x114" />
        <Favicon rel="apple-touch-icon" size="120x120" />
        <Favicon rel="apple-touch-icon" size="144x144" />
        <Favicon rel="apple-touch-icon" size="152x152" />
        <Favicon rel="apple-touch-icon" size="180x180" />
        <Favicon rel="icon" type="image/png" size="192x192" />
        <Favicon rel="icon" type="image/png" size="32x32" />
        <Favicon rel="icon" type="image/png" size="96x96" />
        <Favicon rel="icon" type="image/png" size="16x16" />
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/favicon/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff" />
      </NextHead>
      {noContent ? null : (
        <Box tag="header" direction="row-responsive" wrap flex="grow">
          <Box align="center">
            <a href="/">
              <Box elevation="medium" width="300px">
                <Art />
              </Box>
            </a>
          </Box>
          <Box align="center" flex gap="xsmall" margin="medium">
            <Heading margin="xsmall">
              <Title href={url} label={title} />
            </Heading>
            <Heading level="3" margin="xsmall">
              {description}
            </Heading>
            <Share title={titleHead} author="happyhourdotfm" url={url} />
          </Box>
        </Box>
      )}
    </>
  )
}

const Title = styled(Anchor)`
  &:hover {
    text-decoration: none;
  }
`

const Art = styled(Image).attrs({src: '/art300.jpg', width: 300})``
