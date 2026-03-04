import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

/**
 * Sidebar Component
 * Shows game categories for filtering
 * Responsive design with mobile toggle
 */
export default function Sidebar({
  categories,
  selectedCategory,
  selectedDifficulty,
  onCategoryChange,
  onDifficultyChange,
  isLoading = false,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const difficultyOptions = [
    { value: 'impossible', label: 'Impossible', icon: '⬛' },
    { value: 'extreme', label: 'Extreme', icon: '🟣' },
    { value: 'hard', label: 'Hard', icon: '🔴' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'easy', label: 'Easy', icon: '🟢' },
  ]

  const categoryIcons = {
    action: '⚔️',
    puzzle: '🧩',
    strategy: '♟️',
    multiplayer: '👥',
    casual: '🎮',
    adventure: '🗺️',
    sports: '🏆',
    rhythm: '🎵',
  }

  const getCategoryIcon = (slug) => {
    const lowerSlug = slug?.toLowerCase() || ''
    return categoryIcons[lowerSlug] || '🎮'
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-primary p-3 text-white shadow-lg md:hidden"
        aria-label="Toggle filters"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-gray-800 border-r border-gray-700 transition-transform duration-300 md:relative md:z-0 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="border-b border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white">Filters</h2>
        </div>

        {/* Category List */}
        <div className="p-6">
          {/* All Games (Show All) */}
          <button
            onClick={() => {
              onCategoryChange(null)
              setIsMobileOpen(false)
            }}
            disabled={isLoading}
            className={`w-full px-6 py-3 text-left font-medium transition-all duration-200 ${
              selectedCategory === null
                ? 'border-r-4 border-primary bg-primary/20 text-primary'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } disabled:opacity-50`}
          >
            <span className="mr-2">🎮</span>All Games
          </button>

          {/* Category Items */}
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">Loading categories...</div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.slug)
                  setIsMobileOpen(false)
                }}
                className={`w-full px-6 py-3 text-left font-medium transition-all duration-200 ${
                  selectedCategory === category.slug
                    ? 'border-r-4 border-primary bg-primary/20 text-primary'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-2">{getCategoryIcon(category.slug)}</span>
                {category.name}
                <span className="float-right text-xs text-gray-500">
                  ({category.game_count})
                </span>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400">No categories found</div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-700 my-2"></div>

          {/* Difficulty Filter Section */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-3">Difficulty</h3>
            <button
              onClick={() => {
                onDifficultyChange(null)
                setIsMobileOpen(false)
              }}
              disabled={isLoading}
              className={`w-full px-4 py-2 text-left font-medium transition-all duration-200 rounded mb-2 ${
                selectedDifficulty === null
                  ? 'border border-primary bg-primary/20 text-primary'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } disabled:opacity-50`}
            >
              🎮 All Difficulties
            </button>
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onDifficultyChange(option.value)
                  setIsMobileOpen(false)
                }}
                disabled={isLoading}
                className={`w-full px-4 py-2 text-left font-medium transition-all duration-200 rounded mb-2 ${
                  selectedDifficulty === option.value
                    ? 'border border-primary bg-primary/20 text-primary'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } disabled:opacity-50`}
              >
                {option.icon} {option.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
