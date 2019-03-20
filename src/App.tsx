import React from 'react'
import { Root, Routes } from 'react-static'
import { Grommet, Box } from 'grommet'

const theme = {
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
  },
}

function App() {
  return (
    <Root>
      <Grommet theme={theme} full>
        <Box fill>
          <Box pad="medium" width="xlarge" alignSelf="center">
            <Routes />
          </Box>
        </Box>
      </Grommet>
    </Root>
  )
}

export default App
