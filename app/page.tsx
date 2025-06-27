import { Suspense } from "react";
import EpisodeList from "../components/EpisodeList";
import Pagination from "../components/Pagination";
import Listen from "../components/Listen";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getEpisodes } from "../lib/episodes";

interface HomePageProps {
  searchParams: { page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = parseInt(searchParams.page || "1");
  const episodesPerPage = 10;

  const { episodes, totalEpisodes } = await getEpisodes();
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);
  const startIndex = (page - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = episodes.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Listen />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading episodes...</div>}>
            <EpisodeList episodes={currentEpisodes} />
          </Suspense>
          <Pagination currentPage={page} totalPages={totalPages} baseUrl="/" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
