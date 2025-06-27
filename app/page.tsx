import { Suspense } from "react";
import type { Metadata } from "next";
import EpisodeListWithSearch from "../components/EpisodeListWithSearch";
import Listen from "../components/Listen";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getEpisodes } from "../lib/episodes";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Happy Hour with Dennis and Erik",
    description: "A podcast about life, comedy, and everything in between",
    openGraph: {
      title: "Happy Hour with Dennis and Erik",
      description: "A podcast about life, comedy, and everything in between",
      images: [
        {
          url: "https://happyhour.fm/art.jpg",
          width: 3000,
          height: 3000,
          alt: "Happy Hour with Dennis and Erik",
        },
      ],
      type: "website",
      siteName: "Happy Hour with Dennis and Erik",
    },
    twitter: {
      card: "summary_large_image",
      title: "Happy Hour with Dennis and Erik",
      description: "A podcast about life, comedy, and everything in between",
      images: [
        {
          url: "https://happyhour.fm/art.jpg",
          alt: "Happy Hour with Dennis and Erik",
        },
      ],
      creator: "@happyhourdotfm",
      site: "@happyhourdotfm",
    },
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams;
  const { episodes } = await getEpisodes();
  const episodesPerPage = 10;

  return (
    <div className="space-y-8">
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
