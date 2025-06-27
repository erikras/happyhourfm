"use client";

import { useState, useMemo } from "react";
import { Episode } from "../lib/episodes";
import EpisodeList from "./EpisodeList";
import SearchBox from "./SearchBox";
import Pagination from "./Pagination";

interface EpisodeListWithSearchProps {
  episodes: Episode[];
  episodesPerPage: number;
}

export default function EpisodeListWithSearch({
  episodes,
  episodesPerPage,
}: EpisodeListWithSearchProps) {
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>(episodes);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination for filtered episodes
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = filteredEpisodes.slice(startIndex, endIndex);

  // Reset to page 1 when search results change
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredEpisodes]);

  return (
    <div>
      <SearchBox episodes={episodes} onFilteredEpisodes={setFilteredEpisodes} />
      <EpisodeList episodes={currentEpisodes} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/"
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
