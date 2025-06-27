import { ghURL } from "../util/constants";
import { prefixMp3 } from "../util/prefixMp3";

export type DownloadBarProps = {
  frontmatter: {
    slug?: string;
    date: string;
  };
};

export default function DownloadBar({ frontmatter }: DownloadBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
      <div>
        <a
          download=""
          href={prefixMp3(`${frontmatter.slug}.mp3`)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download Episode
        </a>
      </div>

      <div className="text-gray-600">{frontmatter.date}</div>

      <div>
        <a
          href={`${ghURL}/edit/master/content/${frontmatter.slug}.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Show Notes
        </a>
      </div>
    </div>
  );
}
