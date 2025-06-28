"use client";

import { useState, useEffect } from "react";
import AudioCard from "audiocard";
import { prefixMp3 } from "../util/prefixMp3";
import type { Episode } from "../lib/episodes";

type Props = {
  episode: Episode;
  image?: string;
  linkToShowNotes?: boolean;
  autoPlay?: boolean;
};

export default function AudioCardComponent({
  episode,
  image,
  linkToShowNotes,
  autoPlay,
}: Props) {
  const [isClient, setIsClient] = useState(false);
  const audioUrl = prefixMp3(`${episode.frontmatter.slug}.mp3`);
  const imageUrl =
    image ||
    (episode.frontmatter.art ? `/${episode.frontmatter.art}` : "/art.jpg");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show a loading placeholder until client-side rendering is ready
  if (!isClient) {
    return (
      <div className="w-full mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-6">
      <AudioCard
        title={episode.frontmatter.title}
        art={imageUrl}
        source={audioUrl}
        autoPlay={autoPlay}
        color="#cc9966"
        background="#FFFFFF"
        progressBarBackground="#E5E7EB"
        progressBarCompleteBackground="#cc9966"
        skipBackSeconds={10}
        skipForwardSeconds={30}
        preload="none"
      />

      {linkToShowNotes && (
        <div className="mt-4 text-center">
          <a
            href={`/${episode.frontmatter.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Show Notes
          </a>
        </div>
      )}
    </div>
  );
}
