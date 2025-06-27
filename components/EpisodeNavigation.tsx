import Link from "next/link";
import type { Episode } from "../lib/episodes";

interface EpisodeNavigationProps {
  currentEpisode: Episode;
  previousEpisode?: Episode | null;
  nextEpisode?: Episode | null;
}

export default function EpisodeNavigation({
  currentEpisode,
  previousEpisode,
  nextEpisode,
}: EpisodeNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 pt-8 border-t border-gray-200">
      <div className="flex-1">
        {previousEpisode && (
          <Link
            href={`/${previousEpisode.frontmatter.slug}`}
            className="group flex items-center gap-3 text-left hover:text-brand transition-colors duration-200"
          >
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-brand transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                Previous Episode
              </div>
              <div className="font-medium text-gray-900 group-hover:text-brand transition-colors duration-200">
                {previousEpisode.frontmatter.title}
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {nextEpisode && (
          <Link
            href={`/${nextEpisode.frontmatter.slug}`}
            className="group flex items-center gap-3 text-right hover:text-brand transition-colors duration-200"
          >
            <div>
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                Next Episode
              </div>
              <div className="font-medium text-gray-900 group-hover:text-brand transition-colors duration-200">
                {nextEpisode.frontmatter.title}
              </div>
            </div>
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-brand transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
