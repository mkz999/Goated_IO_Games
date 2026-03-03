import React from 'react'
import { Search, X } from 'lucide-react'

/**
 * SearchBar Component
 * Allows users to search for games by title, description, or tags
 */
export default function SearchBar({ value, onChange, placeholder = 'Search games...' }) {
  const handleClearSearch = () => {
    onChange('')
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-12 pr-10 text-white placeholder-gray-500 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
