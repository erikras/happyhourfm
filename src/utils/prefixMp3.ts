const prefixes = [
  'dts.podtrac.com/redirect.mp3/',
  'chtbl.com/track/73173/',
  'pdcn.co/e/',
]

export const prefixMp3 = (file: string) =>
  `https://${prefixes.reduce(
    (result, prefix) => `${prefix}${result}`,
    `happyhour.fm/media/${file}`,
  )}`
