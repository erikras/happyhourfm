"use client";

import * as React from "react";
import { copyToClipboard } from "./copyToClipboard";
import * as qs from "qs";
import { windowPopup } from "./windowPopup";
import TwitterIcon from "../icons/TwitterIcon";
import FacebookIcon from "../icons/FacebookIcon";
import PatreonIcon from "../icons/PatreonIcon";
import CopyIcon from "../icons/CopyIcon";
import CheckIcon from "../icons/CheckIcon";

export interface ShareRowProps {
  title?: string;
  description?: string;
  media?: string;
  url?: string;
  author?: string;
}

// Function to truncate description for social media sharing
function truncateDescription(
  description: string,
  maxLength: number = 80,
): string {
  if (description.length <= maxLength) {
    return description;
  }

  // Try to truncate at a word boundary
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.8) {
    // If we can find a space in the last 20% of the text
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

export default function Share(props: ShareRowProps) {
  const [didCopy, setDidCopy] = React.useState(false);
  const { title, description, author } = props;
  const url = props.url
    ? props.url
    : typeof window !== "undefined"
    ? window.location.href
    : "";

  // Create share text with title and truncated description
  const shareText = description
    ? `${title} - ${truncateDescription(description, 80)}`
    : title;

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?${qs.stringify({
    u: url,
  })}`;
  const twUrl = `https://twitter.com/intent/tweet?${qs.stringify({
    text: shareText,
    url,
    via: author,
  })}`;

  const handleShare = (href: string) => () => {
    windowPopup(href, 500, 300);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      <button
        onClick={handleShare(twUrl)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1da1f2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors duration-200"
      >
        <TwitterIcon className="w-4 h-4" />
        Tweet
      </button>

      <button
        onClick={handleShare(fbUrl)}
        className="flex items-center gap-2 px-4 py-2 bg-[#4267b2] text-white rounded-lg hover:bg-[#365899] transition-colors duration-200"
      >
        <FacebookIcon className="w-4 h-4" />
        Share
      </button>

      <a
        href="https://patreon.com/happyhour"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#e85b46] text-white rounded-lg hover:bg-[#d54a35] transition-colors duration-200"
      >
        <PatreonIcon className="w-4 h-4" />
        Become a Patron
      </a>

      <button
        onClick={() => {
          copyToClipboard(window.location.href);
          setDidCopy(true);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
      >
        {didCopy ? (
          <>
            <CheckIcon className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <CopyIcon className="w-4 h-4" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
