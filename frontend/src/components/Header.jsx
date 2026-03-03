import React from 'react'

/**
 * Header Component
 * Main site header with logo and title
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-700 bg-gray-900/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎮</span>
          <div>
            <h1 className="text-3xl font-black gradient-text">Goated IO Games</h1>
            <p className="text-sm text-gray-400">Discover & Play Amazing Browser Games</p>
          </div>
        </div>
      </div>
    </header>
  )
}
