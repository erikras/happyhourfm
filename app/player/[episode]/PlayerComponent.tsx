"use client";

import { useState, useEffect } from "react";
import AudioCard from "audiocard";
import { prefixMp3 } from "../../../util/prefixMp3";
import type { Episode } from "../../../lib/episodes";

interface PlayerComponentProps {
  episode: Episode;
}

export default function PlayerComponent({ episode }: PlayerComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const audioUrl = prefixMp3(`${episode.frontmatter.slug}.mp3`);
  const imageUrl = episode.frontmatter.art
    ? `https://happyhour.fm/${episode.frontmatter.art}`
    : "https://happyhour.fm/art.jpg";

  return (
    <div className="w-full h-full bg-white p-4">
      <AudioCard
        title={episode.frontmatter.title}
        art={imageUrl}
        source={audioUrl}
        autoPlay={false}
        color="#cc9966"
        background="#FFFFFF"
        progressBarBackground="#E5E7EB"
        progressBarCompleteBackground="#cc9966"
        skipBackSeconds={10}
        skipForwardSeconds={30}
        preload="none"
      />
    </div>
  );
}
