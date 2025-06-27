import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  onPageChange,
}: PaginationProps) {
  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}?page=${page}`;
  };

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // If onPageChange is provided, use client-side pagination
  if (onPageChange) {
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Previous
          </button>
        )}

        {renderPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
              page === currentPage
                ? "bg-brand text-white"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Next
          </button>
        )}
      </div>
    );
  }

  // Otherwise, use server-side routing
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)}>
          <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            Previous
          </div>
        </Link>
      )}

      {renderPageNumbers().map((page) => (
        <Link key={page} href={getPageUrl(page)}>
          <div
            className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
              page === currentPage
                ? "bg-brand text-white"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </div>
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)}>
          <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            Next
          </div>
        </Link>
      )}
    </div>
  );
}
