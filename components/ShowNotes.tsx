import type { Episode } from "../lib/episodes";

type Props = { episode: Episode };

export default function ShowNotes({ episode }: Props) {
  if (!episode || !episode.body) return <div>no content</div>;

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:text-gray-900 prose-headings:font-semibold
            prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-6
            prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-5
            prose-h4:text-lg prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-brand prose-a:font-medium prose-a:no-underline hover:prose-a:text-brand-dark hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-em:text-gray-700 prose-em:italic
            prose-ul:text-gray-700 prose-ul:my-4
            prose-ol:text-gray-700 prose-ol:my-4
            prose-li:text-gray-700 prose-li:my-1
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
            prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-hr:border-gray-300 prose-hr:my-8
            prose-img:rounded-lg prose-img:shadow-md
            prose-table:border-collapse prose-table:w-full
            prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3 prose-th:text-left prose-th:font-semibold
            prose-td:border prose-td:border-gray-300 prose-td:p-3"
          dangerouslySetInnerHTML={{ __html: episode.body }}
        />
      </div>
    </div>
  );
}
