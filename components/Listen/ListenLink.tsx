import * as React from "react";

export interface ListenLinkProps {
  src: string;
  href: string;
  text: string;
}

export function ListenLink({ src, href, text }: ListenLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl text-decoration-none bg-blue-900/0 transition-colors duration-100 ease-out text-xl p-1 text-black hover:bg-blue-900/20"
    >
      <img
        src={`/listen/${src}`}
        width="40"
        height="40"
        className="mr-2.5 align-middle rounded-xl"
        alt={text}
      />
      {text}
    </a>
  );
}
