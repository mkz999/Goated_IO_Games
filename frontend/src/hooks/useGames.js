import React, { useState, useEffect, useCallback } from 'react'
import { gamesAPI, categoriesAPI } from '../api/client'

/**
 * Custom hook for managing games data
 * Handles fetching, filtering, sorting, and searching
 */
export function useGames(initialCategory = null) {
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [sortBy, setSortBy] = useState('-created_at')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories()
        setCategories(response.data.results || response.data)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  // Fetch games based on filters
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const params = {
          ordering: sortBy,
          page: currentPage,
        }

        if (selectedDifficulty) {
          params.difficulty = selectedDifficulty
        }

        let response
        if (selectedCategory) {
          response = await gamesAPI.getGamesByCategory(selectedCategory, params)
        } else {
          response = await gamesAPI.getGames(params)
        }

        const gamesList = response.data.results || response.data
        setGames(gamesList)
        
        // Extract pagination info from response
        if (response.data.count !== undefined) {
          const count = response.data.count
          const pageSize = 12
          const pages = Math.ceil(count / pageSize)
          setTotalCount(count)
          setTotalPages(pages)
        }
        
        setError(null)
      } catch (err) {
        console.error('Error fetching games:', err)
        setError('Failed to load games. Please try again.')
        setGames([])
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [selectedCategory, selectedDifficulty, sortBy, currentPage])

  // Filter games by search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGames(games)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = games.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.short_description?.toLowerCase().includes(query) ||
        game.tags_list?.some(tag => tag.toLowerCase().includes(query))
      )
      setFilteredGames(filtered)
    }
  }, [games, searchQuery])

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }, [])

  const handleDifficultyChange = useCallback((difficulty) => {
    setSelectedDifficulty(difficulty)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((sort) => {
    setSortBy(sort)
    setCurrentPage(1)
  }, [])

  return {
    games: filteredGames,
    allGames: games,
    categories,
    selectedCategory,
    selectedDifficulty,
    sortBy,
    searchQuery,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    handleSearch,
    handleCategoryChange,
    handleDifficultyChange,
    handleSortChange,
    setCurrentPage,
  }
}

/**
 * Custom hook for managing favorites
 * Uses localStorage for persistence
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(new Set())
  const [userId] = useState(() => {
    // Generate or retrieve user ID
    let id = localStorage.getItem('userId')
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('userId', id)
    }
    return id
  })

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)))
    }
  }, [])

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites) => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)))
  }, [])

  const addFavorite = useCallback(async (gameId) => {
    try {
      await gamesAPI.addFavorite(gameId, userId)
      const newFavorites = new Set(favorites)
      newFavorites.add(gameId)
      setFavorites(newFavorites)
      saveFavorites(newFavorites)
    } catch (err) {
      console.error('Error adding favorite:', err)
    }
  }, [favorites, saveFavorites, userId])

  const removeFavorite = useCallback(async (gameId) => {
    try {
      await gamesAPI.removeFavorite(gameId, userId)
      const newFavorites = new Set(favorites)
      newFavorites.delete(gameId)
      setFavorites(newFavorites)
      saveFavorites(newFavorites)
    } catch (err) {
      console.error('Error removing favorite:', err)
    }
  }, [favorites, saveFavorites, userId])

  const toggleFavorite = useCallback((gameId) => {
    if (favorites.has(gameId)) {
      removeFavorite(gameId)
    } else {
      addFavorite(gameId)
    }
  }, [favorites, addFavorite, removeFavorite])

  const isFavorited = useCallback((gameId) => favorites.has(gameId), [favorites])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
  }
}
