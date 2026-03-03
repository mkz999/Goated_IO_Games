import React from 'react'
import { Heart } from 'lucide-react'
import { gamesAPI } from '../api/client'

/**
 * GameCard Component
 * Displays individual game thumbnail with title, rating, and hover effects
 */
export default function GameCard({
  game,
  isFavorited = false,
  onFavoriteToggle = () => {},
  onGameClick = () => {},
}) {
  const handleCardClick = async (e) => {
    if (e.target.closest('.favorite-btn')) {
      return
    }
    try {
      await gamesAPI.incrementPlayCount(game.id)
      onGameClick(game)
    } catch (err) {
      console.error('Error incrementing play count:', err)
      onGameClick(game)
    }
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    onFavoriteToggle(game.id)
  }

  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-2">
        {/* Image Container with Fixed Height */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-700">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-60" />

          {/* Top Right Section - Featured Badge */}
          <div className="absolute top-2 right-2 h-6 flex items-center">
            {game.is_featured && (
              <div className="bg-gradient-to-r from-primary to-secondary px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap text-center">
                new🔥
              </div>
            )}
          </div>

          {/* Top Left Section - Favorite Button */}
          <div className="absolute top-2 left-2">
            <button
              onClick={handleFavoriteClick}
              className="favorite-btn rounded-full bg-black/50 p-2 transition-all duration-300 hover:bg-black/80 hover:scale-110 inline-flex"
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={20}
                className={`transition-all duration-300 ${
                  isFavorited
                    ? 'fill-secondary text-secondary'
                    : 'text-gray-300 hover:text-secondary'
                }`}
              />
            </button>
          </div>

          {/* Bottom Section - Fixed Height Container */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 gap-2 bg-gradient-to-t from-black/40 to-transparent">
            {/* Difficulty Badge - Fixed Width & Height */}
            <div className="flex-shrink-0 w-20 h-6 flex items-center justify-center">
              <div
                className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap w-full text-center ${
                  game.difficulty === 'easy'
                    ? 'bg-green-600'
                    : game.difficulty === 'medium'
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
              >
                {game.difficulty?.toUpperCase()}
              </div>
            </div>

            {/* Rating Display - Fixed Width & Height */}
            <div className="flex-shrink-0 w-14 h-6 flex items-center justify-center rounded-full bg-black/70 px-1 gap-0.5">
              <span className="text-sm font-bold text-yellow-400 flex-shrink-0">★</span>
              <span className="text-sm font-semibold text-white flex-shrink-0">
                {game.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors duration-300 group-hover:gradient-text">
            {game.title}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-gray-400">
            {game.short_description || 'Exciting browser game'}
          </p>

          {/* Category */}
          <div className="mb-3 flex flex-wrap gap-2">
            {Array.isArray(game.category) ? (
              game.category.map((cat, idx) => (
                <span key={idx} className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                  {typeof cat === 'string' ? cat : cat.name}
                </span>
              ))
            ) : (
              <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                {game.category}
              </span>
            )}
          </div>

          {/* Play Count */}
          <p className="text-xs text-gray-500">👾 {game.play_count.toLocaleString()} plays</p>
        </div>
      </div>
    </div>
  )
}
