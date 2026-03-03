import React, { useState, useEffect } from 'react'
import { gamesAPI } from '../api/client'

/**
 * GameModal Component
 * Display full game information and launch link
 */
export default function GameModal({ game, isOpen, onClose, onPlay }) {
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  // Check if user has already voted for this game
  useEffect(() => {
    if (isOpen && game) {
      const votedGames = JSON.parse(localStorage.getItem('votedGames') || '{}')
      if (votedGames[game.id]) {
        setUserRating(votedGames[game.id])
        setHasVoted(true)
      } else {
        setUserRating(0)
        setHasVoted(false)
      }
    }
  }, [game?.id, isOpen])

  if (!isOpen || !game) return null

  const handlePlayClick = () => {
    onPlay(game)
    onClose()
  }

  const handleRatingSubmit = async (rating) => {
    if (hasVoted) return
    
    try {
      await gamesAPI.submitRating(game.id, rating)
      setUserRating(rating)
      setHasVoted(true)
      
      // Save to localStorage
      const votedGames = JSON.parse(localStorage.getItem('votedGames') || '{}')
      votedGames[game.id] = rating
      localStorage.setItem('votedGames', JSON.stringify(votedGames))
      
      setRatingSubmitted(true)
      setTimeout(() => setRatingSubmitted(false), 2000)
    } catch (err) {
      console.error('Error submitting rating:', err)
    }
  }

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header with Close Button */}
          <div className="sticky top-0 flex items-center justify-between border-b border-gray-700 bg-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white">{game.title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {/* Game Image */}
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="h-64 w-full object-cover"
              />
            </div>

            {/* Game Info Grid */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {/* Rating */}
              <div className="rounded-lg bg-gray-700 p-4">
                <p className="text-xs font-semibold text-gray-400">RATING</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ★ {typeof game.rating === 'string' ? game.rating : `${game.rating}/5`}
                </p>
              </div>

              {/* PlayCount */}
              <div className="rounded-lg bg-gray-700 p-4">
                <p className="text-xs font-semibold text-gray-400">PLAYS</p>
                <p className="text-2xl font-bold text-primary">
                  {(game.play_count / 1000).toFixed(1)}K
                </p>
              </div>

              {/* Difficulty */}
              <div className="rounded-lg bg-gray-700 p-4">
                <p className="text-xs font-semibold text-gray-400">DIFFICULTY</p>
                <p className={`text-lg font-bold uppercase ${
                  game.difficulty === 'easy'
                    ? 'text-green-400'
                    : game.difficulty === 'medium'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}>
                  {game.difficulty}
                </p>
              </div>

              {/* Category */}
              <div className="rounded-lg bg-gray-700 p-4">
                <p className="text-xs font-semibold text-gray-400">CATEGORY</p>
                <p className="text-lg font-bold text-primary">
                  {Array.isArray(game.category) 
                    ? game.category.map(c => c.name || c).join(', ')
                    : game.category.name || game.category
                  }
                </p>
              </div>
            </div>

            {/* Rate This Game */}
            <div className="mb-6 rounded-lg bg-gray-700 p-4">
              <p className="mb-3 text-sm font-semibold text-gray-300">RATE THIS GAME</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingSubmit(star)}
                    onMouseEnter={() => !hasVoted && setHoverRating(star)}
                    onMouseLeave={() => !hasVoted && setHoverRating(0)}
                    disabled={hasVoted}
                    className={`transition-transform ${
                      hasVoted ? 'cursor-not-allowed' : 'hover:scale-110'
                    }`}
                  >
                    <span
                      className={`text-3xl transition-colors ${
                        (hoverRating || userRating) >= star
                          ? 'text-yellow-400'
                          : hasVoted ? 'text-gray-600' : 'text-gray-500'
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              {hasVoted && (
                <p className="mt-2 text-sm text-blue-400 font-semibold">✓ You've already voted: {userRating}★</p>
              )}
              {ratingSubmitted && (
                <p className="mt-2 text-sm text-green-400">✓ Rating submitted!</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-white">About</h3>
              <p className="text-gray-300 leading-relaxed">{game.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-700">
              <button
                onClick={handlePlayClick}
                className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-3 font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                🎮 Play Now
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-600 py-3 font-bold text-white transition-all duration-300 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
