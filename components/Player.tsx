import { prefixMp3 } from "../util/prefixMp3";
import { Episode } from "../lib/episodes";

type Props = {
  episode: Episode;
  image?: string;
  linkToShowNotes?: boolean;
  autoPlay?: boolean;
};

export default function Player({
  episode,
  image,
  linkToShowNotes,
  autoPlay,
}: Props) {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={
              image ||
              (episode.frontmatter.art
                ? `/${episode.frontmatter.art}`
                : "/art.jpg")
            }
            alt={episode.frontmatter.title}
            className="w-48 h-48 object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {episode.frontmatter.title}
          </h2>

          <audio
            controls
            autoPlay={autoPlay}
            preload="none"
            className="w-full mb-4"
          >
            <source
              src={prefixMp3(`${episode.frontmatter.slug}.mp3`)}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>

          {linkToShowNotes && (
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
          )}
        </div>
      </div>
    </div>
  );
}
