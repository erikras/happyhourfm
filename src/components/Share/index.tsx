import * as React from 'react'
import styled from 'styled-components'
import { Box, Button } from 'grommet'
import { Checkmark, Twitter, Facebook, Link } from 'grommet-icons'
import { copyToClipboard } from './copyToClipboard'
import * as qs from 'qs'
import { windowPopup } from './windowPopup'

export interface ShareRowProps {
  title?: string
  media?: string
  url?: string
  author?: string
}

export default function Share(props: ShareRowProps) {
  const [didCopy, setDidCopy] = React.useState(false)
  const { title, author } = props
  const url = props.url
    ? props.url
    : typeof window !== 'undefined'
    ? window.location.href
    : ''
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?${qs.stringify({
    u: url,
  })}`
  const twUrl = `https://twitter.com/intent/tweet?${qs.stringify({
    text: title,
    url,
    via: author,
  })}`

  const handleShare = (href: string) => () => {
    windowPopup(href, 500, 300)
  }

  return (
    <Box
      direction="row-responsive"
      align="center"
      justify="center"
      gap="small"
      margin={{ top: 'small' }}
    >
      <TwitterButton
        icon={<Twitter color="white" />}
        onClick={handleShare(twUrl)}
        label="Tweet"
      />
      <FacebookButton
        icon={<Facebook color="white" />}
        onClick={handleShare(fbUrl)}
        label="Share"
      />
      <Button
        icon={didCopy ? <Checkmark /> : <Link />}
        onClick={() => {
          copyToClipboard(window.location.href)
          setDidCopy(true)
        }}
        label={didCopy ? 'Copied!' : 'Copy'}
      />
    </Box>
  )
}

const TwitterButton = styled(Button)`
  background-color: #1da1f2;
  color: white;
`

const FacebookButton = styled(Button)`
  background-color: #4267b2;
  color: white;
`
