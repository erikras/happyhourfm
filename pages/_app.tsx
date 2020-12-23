import {AppProps} from 'next/app'
import React from 'react'
import {createGlobalStyle} from 'styled-components'
import styledNormalize from 'styled-normalize'
import {Box, Grommet, ThemeType} from 'grommet'

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
`

export const theme: ThemeType = {
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

const MyApp = ({Component, pageProps}: AppProps) => {
  if (pageProps.noWrap) {
    return <Component {...pageProps} />
  }
  return (
    <Grommet theme={theme} full>
      <GlobalStyle />
      <Box fill>
        <Box pad="medium" width="xlarge" alignSelf="center">
          <Component {...pageProps} />
        </Box>
      </Box>
    </Grommet>
  )
}

export default MyApp
