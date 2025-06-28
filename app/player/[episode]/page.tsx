import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEpisode } from "../../../lib/episodes";
import PlayerComponent from "./PlayerComponent";

interface PlayerPageProps {
  params: Promise<{ episode: string }>;
}

export async function generateMetadata({
  params,
}: PlayerPageProps): Promise<Metadata> {
  const { episode: episodeSlug } = await params;
  const episode = await getEpisode(episodeSlug);

  if (!episode) {
    return {
      title: "Episode Not Found",
    };
  }

  const title = `Happy Hour – ${episode.frontmatter.title}`;
  const description = episode.frontmatter.description;
  const imageUrl = episode.frontmatter.art
    ? `https://happyhour.fm/${episode.frontmatter.art}`
    : "https://happyhour.fm/art.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 900,
          height: 900,
          alt: title,
        },
      ],
      type: "article",
      siteName: "Happy Hour with Dennis and Erik",
    },
    twitter: {
      card: "player",
      title,
      description,
      images: [imageUrl],
      creator: "@happyhourdotfm",
      site: "@happyhourdotfm",
    },
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { episode: episodeSlug } = await params;
  const episode = await getEpisode(episodeSlug);

  if (!episode) {
    notFound();
  }

  return <PlayerComponent episode={episode} />;
}
