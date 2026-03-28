import { useState, useRef, useEffect } from "react";

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  className = "",
}: PaginationProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    onItemsPerPageChange?.(value);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex items-center justify-end mt-29.5 gap-6 py-4 ${className}`}
      data-testid="pagination"
    >
      {/* Rows per page selector */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-sans text-NEUTRAL-1200">Rows per page</span>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 border border-GREY-100 rounded-md text-sm text-NEUTRAL-100 bg-white hover:bg-GREY-100/20 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              data-testid="rows-per-page-button"
            >
              {itemsPerPage}
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="#80898E"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div
                className="absolute bottom-full mb-1 left-0 bg-white border border-GREY-100 rounded-md shadow-lg z-10 min-w-15"
                data-testid="rows-per-page-dropdown"
              >
                {itemsPerPageOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-GREY-100/20 transition-colors ${
                      option === itemsPerPage
                        ? "bg-PURPLE-100/10 text-PURPLE-100"
                        : "text-NEUTRAL-100"
                    }`}
                    onClick={() => handleItemsPerPageChange(option)}
                    data-testid={`rows-option-${option}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page info */}
      <span className="text-sm font-sans text-NEUTRAL-1200" data-testid="page-info">
        {startItem} – {endItem} of {totalItems}
      </span>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
            currentPage === 1
              ? "border-GREY-100 text-GREY-200 cursor-not-allowed"
              : "border-GREY-100 text-NEUTRAL-100 hover:bg-GREY-100/20"
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          data-testid="prev-button"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            currentPage === totalPages
              ? "bg-GREY-100 text-GREY-200 cursor-not-allowed"
              : "bg-NEUTRAL-1200 text-white hover:bg-NEUTRAL-1200"
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          data-testid="next-button"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
