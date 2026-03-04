import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import SearchBar from './components/SearchBar'
import SortOptions from './components/SortOptions'
import GameCard from './components/GameCard'
import GameModal from './components/GameModal'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import { useGames, useFavorites } from './hooks/useGames'
import './index.css'

/**
 * Main App Component
 * Orchestrates all features: filtering, sorting, searching, favorites
 */
function App() {
  const [selectedGame, setSelectedGame] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Custom hooks for games and favorites
  const {
    games,
    categories,
    selectedCategory,
    selectedDifficulty,
    sortBy,
    searchQuery,
    loading,
    error,
    handleSearch,
    handleCategoryChange,
    handleDifficultyChange,
    handleSortChange,
  } = useGames()

  const { favorites, toggleFavorite, isFavorited } = useFavorites()

  // Handle game click - show modal
  const handleGameClick = (game) => {
    setSelectedGame(game)
    setShowModal(true)
  }

  // Handle play button - redirect to game
  const handlePlayGame = (game) => {
    window.open(game.game_url, '_blank', 'noopener,noreferrer')
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false)
    setTimeout(() => setSelectedGame(null), 300)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          onCategoryChange={handleCategoryChange}
          onDifficultyChange={handleDifficultyChange}
          isLoading={loading}
        />

        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Controls Row */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={handleSearch} />
              </div>
              <div className="w-full md:w-48">
                <SortOptions value={sortBy} onChange={handleSortChange} />
              </div>
            </div>

            {/* Results Title */}
            {!loading && games.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedCategory
                    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Games`
                    : 'All Games'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Showing {games.length} game{games.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Error State */}
            {error && <ErrorMessage message={error} />}

            {/* Loading State */}
            {loading && <LoadingSpinner message="Loading games..." />}

            {/* Games Grid */}
            {!loading && !error && games.length > 0 ? (
              <div className="grid auto-rows-max grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorited={isFavorited(game.id)}
                    onFavoriteToggle={toggleFavorite}
                    onGameClick={handleGameClick}
                  />
                ))}
              </div>
            ) : !loading && !error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
                <p className="text-gray-400 text-center max-w-md">
                  {searchQuery
                    ? `No games match your search "${searchQuery}". Try different keywords.`
                    : 'No games available in this category. Try another one!'}
                </p>
              </div>
            ) : null}
          </div>
        </main>
      </div>

      {/* Game Modal */}
      <GameModal
        game={selectedGame}
        isOpen={showModal}
        onClose={handleCloseModal}
        onPlay={handlePlayGame}
      />

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-800 py-8 mt-16">
        <div className="mx-auto max-w-6xl px-4 text-center text-gray-400">
          <p>🎮 Goated IO Games © 2024 | All Rights Reserved</p>
          <p className="text-sm mt-2">Built with React, Django & ❤️</p>
        </div>
      </footer>
    </div>
  )
}

export default App
