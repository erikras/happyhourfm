"use client";

import { useState, useMemo } from "react";
import type { Episode } from "../lib/episodes";

interface SearchBoxProps {
  episodes: Episode[];
  onFilteredEpisodes: (episodes: Episode[]) => void;
}

export default function SearchBox({
  episodes,
  onFilteredEpisodes,
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEpisodes = useMemo(() => {
    if (!searchTerm.trim()) {
      return episodes;
    }

    const term = searchTerm.toLowerCase();
    return episodes.filter((episode) => {
      const title = episode.frontmatter.title.toLowerCase();
      const description = episode.frontmatter.description.toLowerCase();
      const episodeNumber = episode.frontmatter.episode?.toString() || "";

      return (
        title.includes(term) ||
        description.includes(term) ||
        episodeNumber.includes(term)
      );
    });
  }, [episodes, searchTerm]);

  // Update parent component whenever filtered episodes change
  useMemo(() => {
    onFilteredEpisodes(filteredEpisodes);
  }, [filteredEpisodes, onFilteredEpisodes]);

  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search episodes by title, description, or episode number..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-brand focus:border-brand transition-colors duration-200"
        />
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => setSearchTerm("")}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          Found {filteredEpisodes.length} episode
          {filteredEpisodes.length !== 1 ? "s" : ""}
          {filteredEpisodes.length !== episodes.length && (
            <span> out of {episodes.length}</span>
          )}
        </div>
      )}
    </div>
  );
}
