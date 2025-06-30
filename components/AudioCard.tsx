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
  const audioUrl = prefixMp3(`${episode.frontmatter.slug}.mp3`);
  const imageUrl =
    image ||
    (episode.frontmatter.art ? `/${episode.frontmatter.art}` : "/art.jpg");

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
