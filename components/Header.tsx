import Link from "next/link";
import Share from "./Share";
import { Episode } from "../lib/episodes";

interface HeaderProps {
  episode?: Episode;
}

export default function Header({ episode }: HeaderProps) {
  const title = episode
    ? episode.frontmatter.title
    : "Happy Hour with Dennis and Erik";
  const description = episode
    ? undefined // Don't show episode description in header
    : "A candid and open weekly discussion between Dennis and Erik over drinks";
  const shareTitle = episode ? episode.frontmatter.title : "Happy Hour Podcast";
  const shareUrl = episode
    ? `https://happyhour.fm/${episode.frontmatter.slug}`
    : "https://happyhour.fm";

  return (
    <header className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-6 mb-8">
      <div className="flex-shrink-0">
        <Link href="/">
          <div className="shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
            <img
              src="/art300.jpg"
              alt="Happy Hour Podcast"
              width={300}
              height={300}
              className="w-[300px] h-[300px] object-cover"
            />
          </div>
        </Link>
      </div>

      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          <Link
            href="/"
            className="hover:text-brand transition-colors duration-200"
          >
            {title}
          </Link>
        </h1>
        {description && (
          <h2 className="text-xl lg:text-2xl text-gray-700 font-medium">
            {description}
          </h2>
        )}
        <div className="mt-4">
          <Share title={shareTitle} author="happyhourdotfm" url={shareUrl} />
        </div>
      </div>
    </header>
  );
}
