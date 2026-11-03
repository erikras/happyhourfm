import type { Metadata } from 'next';
import { Suspense } from 'react';
import EpisodeListWithSearch from '../components/EpisodeListWithSearch';
import Footer from '../components/Footer';
import Header from '../components/Header';
import JsonLd from '../components/JsonLd';
import Listen from '../components/Listen';
import { getEpisodes } from '../lib/episodes';
import { podcastSeriesJsonLd, rssAlternate, siteUrl } from '../util/seo';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Happy Hour with Dennis and Erik',
    description: 'A podcast about life, comedy, and everything in between',
    alternates: {
      canonical: siteUrl,
      types: rssAlternate,
    },
    openGraph: {
      title: 'Happy Hour with Dennis and Erik',
      description: 'A podcast about life, comedy, and everything in between',
      url: siteUrl,
      images: [
        {
          url: 'https://happyhour.fm/art.jpg',
          width: 3000,
          height: 3000,
          alt: 'Happy Hour with Dennis and Erik',
        },
      ],
      type: 'website',
      siteName: 'Happy Hour with Dennis and Erik',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Happy Hour with Dennis and Erik',
      description: 'A podcast about life, comedy, and everything in between',
      images: [
        {
          url: 'https://happyhour.fm/art.jpg',
          alt: 'Happy Hour with Dennis and Erik',
        },
      ],
      creator: '@happyhourdotfm',
      site: '@happyhourdotfm',
    },
  };
}

export default async function HomePage() {
  const { episodes } = await getEpisodes();
  const episodesPerPage = 10;

  return (
    <div className="space-y-8">
      <JsonLd data={podcastSeriesJsonLd()} />
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Listen />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading episodes...</div>}>
            <EpisodeListWithSearch
              episodes={episodes}
              episodesPerPage={episodesPerPage}
            />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
