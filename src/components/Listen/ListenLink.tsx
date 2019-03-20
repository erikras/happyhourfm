import * as React from 'react'
import styled from 'styled-components'
import { Image } from 'grommet'

export interface ListenLinkProps {
  src: string
  href: string
  text: string
}

const Link = styled('a').attrs({ target: '_blank' })`
  display: block;
  border-radius: 12px;
  text-decoration: none;
  background-color: rgba(0, 115, 157, 0);
  transition: background 100ms ease-out;
  font-size: 20px;
  padding: 5px;
  color: black;
  &:hover {
    background-color: rgba(0, 115, 157, 0.2);
  }
  img {
    margin-right: 10px;
    vertical-align: middle;
    border-radius: 12px;
  }
`
export function ListenLink({ src, href, text }: ListenLinkProps) {
  return (
    <Link href={href}>
      <Image src={`/listen/${src}`} width="40px" height="40px" />
      {text}
    </Link>
  )
}
