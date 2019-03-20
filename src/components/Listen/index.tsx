import * as React from 'react'
import { ListenLink } from './ListenLink'
import { links } from './links'
import { Box } from 'grommet'

export interface ListenProps {}

function Listen(props: ListenProps) {
  return (
    <Box width="300px" gap="xsmall">
      {links.map(link => (
        <ListenLink {...link} />
      ))}
    </Box>
  )
}

export default Listen
