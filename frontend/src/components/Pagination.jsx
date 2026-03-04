import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination Component
 * Displays page buttons and navigation
 */
export default function Pagination({ currentPage, totalPages, onPageChange, isLoading = false }) {
  if (totalPages <= 1) return null

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const maxVisible = 7
    const pages = []
    const halfVisible = Math.floor(maxVisible / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push('...')
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-8">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white transition-all duration-200 hover:border-primary hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-500">
              {page}
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-primary text-white border border-primary'
                  : 'border border-gray-700 bg-gray-800 text-gray-300 hover:border-primary hover:bg-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white transition-all duration-200 hover:border-primary hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={20} />
      </button>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-400 whitespace-nowrap">
        Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
        <span className="font-semibold text-white">{totalPages}</span>
      </div>
    </div>
  )
}
