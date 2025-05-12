import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      role="navigation"
      aria-label="Pagination"
    >
      <button
        className="group bg-background-lighter hover:bg-background focus:ring-primary rounded-md border border-transparent px-3 py-2 text-gray-400 transition focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} className="group-hover:text-primary" />
      </button>
      <span className="bg-background-lighter rounded-md border border-transparent px-4 py-1.5 text-base text-gray-200">
        {currentPage} <span className="text-gray-400">of</span> {totalPages}
      </span>
      <button
        className="group bg-background-lighter hover:bg-background focus:ring-primary rounded-md border border-transparent px-3 py-2 text-gray-400 transition focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={20} className="group-hover:text-primary" />
      </button>
    </nav>
  );
}
