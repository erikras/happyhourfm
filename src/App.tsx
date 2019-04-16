import React from 'react'
import { Root, Routes } from 'react-static'

function App() {
  return (
    <Root>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-T7KGN2M"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      <Routes />
    </Root>
  )
}

export default App
