import TwitterIcon from "./icons/TwitterIcon";
import FacebookIcon from "./icons/FacebookIcon";
import YouTubeIcon from "./icons/YouTubeIcon";
import PatreonIcon from "./icons/PatreonIcon";
import EmailIcon from "./icons/EmailIcon";

export default function Footer() {
  return (
    <footer className="text-center py-8 border-t border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          <a
            href="mailto:happyhourdotfm@gmail.com?subject=Sponsorship"
            className="inline-flex items-center text-brand hover:text-brand-dark transition-colors duration-200"
          >
            <EmailIcon className="w-6 h-6 mr-2" />
            Become a Sponsor
          </a>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <a
          href="https://twitter.com/happyhourdotfm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-200"
        >
          <TwitterIcon className="w-5 h-5 mr-2" />
          Twitter
        </a>

        <a
          href="https://www.facebook.com/happyhourdotfm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <FacebookIcon className="w-5 h-5 mr-2" />
          Facebook
        </a>

        <a
          href="https://www.youtube.com/channel/UCzYPS1v4cCwzv3yiWz0PEPw/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
        >
          <YouTubeIcon className="w-5 h-5 mr-2" />
          YouTube
        </a>

        <a
          href="https://patreon.com/happyhour"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200"
        >
          <PatreonIcon className="w-5 h-5 mr-2" />
          Patreon
        </a>

        <a
          href="mailto:happyhourdotfm@gmail.com"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <EmailIcon className="w-5 h-5 mr-2" />
          Email
        </a>
      </div>

      <p className="text-gray-600">
        © Copyright {new Date().getFullYear()} - Happy Hour with Dennis and
        Erik
      </p>
    </footer>
  );
}
