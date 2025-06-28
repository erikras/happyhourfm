"use client";

import AudioCardComponent from "./AudioCard";
import type { Episode } from "../lib/episodes";

interface AudioCardWrapperProps {
  episode: Episode;
}

export default function AudioCardWrapper({ episode }: AudioCardWrapperProps) {
  return <AudioCardComponent episode={episode} />;
}
