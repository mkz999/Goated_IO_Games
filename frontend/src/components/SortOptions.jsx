import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * SortOptions Component
 * Dropdown menu for sorting games
 */
export default function SortOptions({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { value: '-created_at', label: '📅 Newest' },
    { value: 'created_at', label: '📅 Oldest' },
    { value: '-play_count', label: '👾 Most Played' },
    { value: 'play_count', label: '👾 Least Played' },
    { value: '-rating', label: '⭐ Highest Rated' },
    { value: 'rating', label: '⭐ Lowest Rated' },
  ]

  const selectedLabel = sortOptions.find((opt) => opt.value === value)?.label || 'Sort by'

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full md:w-48">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white transition-all duration-300 hover:border-primary focus:border-primary focus:outline-none"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-2 rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`block w-full px-4 py-2 text-left transition-colors duration-200 hover:bg-primary/20 hover:text-primary ${
                value === option.value
                  ? 'bg-primary/30 text-primary font-semibold'
                  : 'text-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
