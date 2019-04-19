import React from 'react'
import { Grommet, Box } from 'grommet'

export const theme = {
  global: {
    colors: {
      brand: '#cc9966',
      control: {
        light: '#cccc99',
        dark: '#330000',
      },
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
    breakpoints: {
      small: {
        value: 767, // 1px under iPad width
      },
    },
  },
}

interface Props {
  children: JSX.Element[] | JSX.Element
}
function Page({ children }: Props) {
  return (
    <Grommet theme={theme} full>
      <Box fill>
        <Box pad="medium" width="xlarge" alignSelf="center">
          {children}
        </Box>
      </Box>
    </Grommet>
  )
}

export default Page
