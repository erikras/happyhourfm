import { links } from "./Listen/links";

export default function Listen() {
  return (
    <div className="w-full lg:w-80">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Listen on</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        {links.map((link) => (
          <a
            key={link.text}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
          >
            <img
              src={`/listen/${link.src}`}
              alt={link.text}
              className="w-10 h-10 mr-3 rounded-xl"
            />
            <span className="text-lg">{link.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
