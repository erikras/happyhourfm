interface FaviconProps {
  rel: string
  size: string
  type?: string
}

export function Favicon({ rel, size, type }: FaviconProps) {
  return (
    <link
      rel={rel}
      type={type}
      sizes={size}
      href={`/favicon/favicon-${size}.png`}
    />
  )
}
