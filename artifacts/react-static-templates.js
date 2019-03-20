
import universal, { setHasBabelPlugin } from '/Users/erik/Podcasting/Happy Hour/website/node_modules/react-universal-component/dist/index.js'


setHasBabelPlugin()

const universalOptions = {
  loading: () => null,
  error: props => {
    console.error(props.error);
    return <div>An error occurred loading this page's template. More information is available in the console.</div>;
  },
}

const t_0 = universal(import('../src/pages/404.tsx'), universalOptions)
const t_1 = universal(import('../src/pages/episode.tsx'), universalOptions)
const t_2 = universal(import('../src/pages/index.tsx'), universalOptions)
const t_3 = universal(import('../src/pages/episode'), universalOptions)


// Template Map
export default {
  '../src/pages/404.tsx': t_0,
'../src/pages/episode.tsx': t_1,
'../src/pages/index.tsx': t_2,
'../src/pages/episode': t_3
}

export const notFoundTemplate = "../src/pages/404.tsx"
