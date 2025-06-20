import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5, // Show 5 page numbers by default (e.g., 1 ... 4 5 6 ... 10)
}) => {
    if (totalPages <= 1) {
        return null; // Don't render pagination if only one page
    }

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const halfVisible = Math.floor((maxVisiblePages - 1) / 2);
        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust startPage if endPage is near the total pages
        if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        // Adjust endPage if startPage is near 1
        if (startPage === 1 && totalPages > maxVisiblePages) {
            endPage = maxVisiblePages;
        }

        const buttonBaseClasses = "min-w-[36px] h-9 px-3 mx-1 rounded border border-gray-300 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
        const defaultClasses = "bg-white text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50";
        const activeClasses = "bg-blue-600 text-white border-blue-600 cursor-default";
        const ellipsisClasses = "flex items-center justify-center min-w-[36px] h-9 px-1 mx-1 text-sm text-gray-500";

        // "Previous" button
        pageNumbers.push(
            <button
                key="prev"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${buttonBaseClasses} ${defaultClasses}`}
            >
                Prev
            </button>
        );

        // First page and ellipsis (if needed)
        if (startPage > 1) {
            pageNumbers.push(
                <button
                    key={1}
                    onClick={() => handlePageClick(1)}
                    className={`${buttonBaseClasses} ${defaultClasses}`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pageNumbers.push(<span key="start-ellipsis" className={ellipsisClasses}>...</span>);
            }
        }

        // Core page numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`${buttonBaseClasses} ${currentPage === i ? activeClasses : defaultClasses}`}
                >
                    {i}
                </button>
            );
        }

        // Ellipsis and last page (if needed)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<span key="end-ellipsis" className={ellipsisClasses}>...</span>);
            }
            pageNumbers.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageClick(totalPages)}
                    className={`${buttonBaseClasses} ${defaultClasses}`}
                >
                    {totalPages}
                </button>
            );
        }

        // "Next" button
        pageNumbers.push(
            <button
                key="next"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${buttonBaseClasses} ${defaultClasses}`}
            >
                Next
            </button>
        );

        return pageNumbers;
    };

    return (
        <div className="flex justify-center items-center mt-6 py-4">
            {renderPageNumbers()}
        </div>
    );
};

export default Pagination; 