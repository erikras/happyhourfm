"use client";

import * as React from "react";
import { copyToClipboard } from "./copyToClipboard";
import * as qs from "qs";
import { windowPopup } from "./windowPopup";

export interface ShareRowProps {
  title?: string;
  media?: string;
  url?: string;
  author?: string;
}

export default function Share(props: ShareRowProps) {
  const [didCopy, setDidCopy] = React.useState(false);
  const { title, author } = props;
  const url = props.url
    ? props.url
    : typeof window !== "undefined"
    ? window.location.href
    : "";
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?${qs.stringify({
    u: url,
  })}`;
  const twUrl = `https://twitter.com/intent/tweet?${qs.stringify({
    text: title,
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
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
        Tweet
      </button>

      <button
        onClick={handleShare(fbUrl)}
        className="flex items-center gap-2 px-4 py-2 bg-[#4267b2] text-white rounded-lg hover:bg-[#365899] transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Share
      </button>

      <a
        href="https://patreon.com/happyhour"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#e85b46] text-white rounded-lg hover:bg-[#d54a35] transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 .48v23.04h4.22V.48zm15.386 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.386.48z" />
        </svg>
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}
