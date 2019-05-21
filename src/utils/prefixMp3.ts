const prefixes = [
  'https://dts.podtrac.com/redirect.mp3/',
  'https://chtbl.com/track/73173/',
]

export const prefixMp3 = (file: string) =>
  prefixes.reduce(
    (result, prefix) => `${prefix}${result}`,
    `happyhour.fm/media/${file}`,
  )
