"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, lastPage, onPageChange }: PaginationProps) => {
  if (lastPage <= 1) return null;

  const buildPages = (): (number | "ellipsis-left" | "ellipsis-right")[] => {
    // Always: [1] [?…] [cur-1] [cur] [cur+1] [?…] [lastPage]
    const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [1];

    if (lastPage === 1) return pages;

    const windowStart = Math.max(2, currentPage - 1);
    const windowEnd = Math.min(lastPage - 1, currentPage + 1);

    if (windowStart > 2) pages.push("ellipsis-left");

    for (let i = windowStart; i <= windowEnd; i++) {
      pages.push(i);
    }

    if (windowEnd < lastPage - 1) pages.push("ellipsis-right");

    pages.push(lastPage);
    return pages;
  };

  const pages = buildPages();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-4 sm:mt-5 flex-wrap">
      {/* <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#DFE3E8] bg-white text-[#637381] hover:bg-[#F4F6F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button> */}

      {pages.map((page) =>
        typeof page === "string" ? (
          <span
            key={page}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-[#637381] text-sm select-none"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              page === currentPage
                ? "bg-[#122464] text-white"
                : "border border-[#DFE3E8] bg-white text-[#637381] hover:bg-[#F4F6F8]"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#DFE3E8] bg-white text-[#637381] hover:bg-[#F4F6F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button> */}
    </div>
  );
};

export default Pagination;
