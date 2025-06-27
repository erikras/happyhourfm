import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  params: Promise<{ episode: string }>;
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
  const { episode } = await params;
  const ep = await getEpisode(episode);

  if (!ep) {
    return {
      title: "Episode Not Found",
    };
  }

  const title = `Happy Hour – ${ep.frontmatter.title}`;
  const description = ep.frontmatter.description;
  const imageUrl = ep.frontmatter.art
    ? `https://happyhour.fm/${ep.frontmatter.art}`
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
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
      creator: "@happyhourdotfm",
      site: "@happyhourdotfm",
    },
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { episode } = await params;
  const ep = await getEpisode(episode);

  if (!ep) {
    notFound();
  }

  // Get next and previous episodes for navigation
  const [nextEpisode, previousEpisode] = await Promise.all([
    getNextEpisode(episode),
    getPreviousEpisode(episode),
  ]);

  return (
    <div className="space-y-8">
      <Header episode={ep} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Listen />
        </div>
        <div className="lg:col-span-3">
          <DownloadBar frontmatter={ep.frontmatter} />

          <div className="text-lg leading-relaxed mb-6 text-gray-700">
            {ep.frontmatter.description}
          </div>

          {ep.frontmatter.episode && ep.frontmatter.episode >= 146 && (
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

          {ep.frontmatter.youtube ? (
            <YouTube id={ep.frontmatter.youtube} />
          ) : (
            <Player episode={ep} />
          )}

          <ShowNotes episode={ep} />

          <EpisodeNavigation
            currentEpisode={ep}
            nextEpisode={nextEpisode}
            previousEpisode={previousEpisode}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
