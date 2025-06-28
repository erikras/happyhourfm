import { notFound } from "next/navigation";
import { getEpisode } from "../../../lib/episodes";
import PlayerComponent from "./PlayerComponent";

interface PlayerPageProps {
  params: Promise<{ episode: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { episode: episodeSlug } = await params;
  const episode = await getEpisode(episodeSlug);

  if (!episode) {
    notFound();
  }

  return <PlayerComponent episode={episode} />;
}
