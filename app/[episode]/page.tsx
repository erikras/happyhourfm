import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getEpisode,
  getAllEpisodeSlugs,
  getNextEpisode,
  getPreviousEpisode,
} from "@/lib/episodes";
import Listen from "@/components/Listen";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import DownloadBar from "@/components/DownloadBar";
import Player from "@/components/Player";
import ShowNotes from "@/components/ShowNotes";
import YouTube from "@/components/YouTube";
import EpisodeNavigation from "@/components/EpisodeNavigation";
import { defaultImage, url } from "@/util/constants";

interface EpisodePageProps {
  params: { episode: string };
}

export async function generateStaticParams() {
  const slugs = await getAllEpisodeSlugs();
  return slugs.map((slug) => ({
    episode: slug,
  }));
}

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const episode = await getEpisode(params.episode);

  if (!episode) {
    return {
      title: "Episode Not Found",
    };
  }

  const title = `Happy Hour – ${episode.frontmatter.title}`;
  const description = episode.frontmatter.description;
  const imageUrl = episode.frontmatter.art
    ? `${url}/${episode.frontmatter.art}`
    : defaultImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const episode = await getEpisode(params.episode);

  if (!episode) {
    notFound();
  }

  // Get next and previous episodes for navigation
  const [nextEpisode, previousEpisode] = await Promise.all([
    getNextEpisode(params.episode),
    getPreviousEpisode(params.episode),
  ]);

  return (
    <div className="space-y-8">
      <Header episode={episode} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Listen />
        </div>
        <div className="lg:col-span-3">
          <DownloadBar frontmatter={episode.frontmatter} />

          <div className="text-lg leading-relaxed mb-6 text-gray-700">
            {episode.frontmatter.description}
          </div>

          {episode.frontmatter.episode &&
            episode.frontmatter.episode >= 146 && (
              <div className="text-lg leading-relaxed mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <a
                  href="https://patreon.com/happyhour"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Become a Patron at the Gin Martinis tier to watch the video
                  recording of this episode.
                </a>
              </div>
            )}

          {episode.frontmatter.youtube ? (
            <YouTube id={episode.frontmatter.youtube} />
          ) : (
            <Player episode={episode} />
          )}

          <ShowNotes episode={episode} />

          <EpisodeNavigation
            currentEpisode={episode}
            nextEpisode={nextEpisode}
            previousEpisode={previousEpisode}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
