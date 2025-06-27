import { Suspense } from "react";
import EpisodeListWithSearch from "../components/EpisodeListWithSearch";
import Listen from "../components/Listen";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getEpisodes } from "../lib/episodes";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
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
