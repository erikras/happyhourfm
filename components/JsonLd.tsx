import { serializeJsonLd } from '../util/seo';

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized JSON-LD
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
