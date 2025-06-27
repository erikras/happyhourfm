import Link from "next/link";
import type { Episode } from "../lib/episodes";

interface EpisodeListProps {
  episodes: Episode[];
}

export default function EpisodeList({ episodes }: EpisodeListProps) {
  return (
    <div className="space-y-6">
      {episodes.map((episode) => (
        <Link
          key={episode.frontmatter.slug}
          href={`/${episode.frontmatter.slug}`}
        >
          <div className="episode-card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="episode-art w-48 h-48 flex-shrink-0">
                <img
                  src={episode.frontmatter.art || "/art.jpg"}
                  alt={episode.frontmatter.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="play-button">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {episode.frontmatter.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {episode.frontmatter.description}
                </p>
                <div className="text-sm text-gray-500">
                  Episode {episode.frontmatter.episode} •{" "}
                  {episode.frontmatter.date}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
