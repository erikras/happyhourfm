import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AudioCardWrapper from '@/components/AudioCardWrapper';
import DownloadBar from '@/components/DownloadBar';
import EpisodeNavigation from '@/components/EpisodeNavigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Listen from '@/components/Listen';
import ShowNotes from '@/components/ShowNotes';
import {
  getAllEpisodeSlugs,
  getEpisode,
  getNextEpisode,
  getPreviousEpisode,
} from '@/lib/episodes';

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
      title: 'Episode Not Found',
    };
  }

  const title = `Happy Hour – ${ep.frontmatter.title}`;
  const description = ep.frontmatter.description;
  const imageUrl = ep.frontmatter.art
    ? `https://happyhour.fm/${ep.frontmatter.art}`
    : 'https://happyhour.fm/art.jpg';
  const playerUrl = `https://happyhour.fm/player/${ep.frontmatter.slug}`;

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
      type: 'article',
      siteName: 'Happy Hour with Dennis and Erik',
    },
    twitter: {
      card: 'player',
      title,
      description,
      images: [imageUrl],
      creator: '@happyhourdotfm',
      site: '@happyhourdotfm',
    },
    other: {
      'twitter:player': playerUrl,
      'twitter:player:width': '480',
      'twitter:player:height': '200',
      'twitter:image:alt': `Cover art for ${title}`,
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

          <AudioCardWrapper episode={ep} />

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
