import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Games API
export const gamesAPI = {
  // Get all games with optional filtering
  getGames: (params = {}) => 
    apiClient.get('/games/', { params }),

  // Get featured games
  getFeaturedGames: () => 
    apiClient.get('/games/featured/'),

  // Get single game details
  getGameDetail: (id) => 
    apiClient.get(`/games/${id}/`),

  // Search games
  searchGames: (query) => 
    apiClient.get('/games/', { params: { search: query } }),

  // Filter by category
  getGamesByCategory: (category, params = {}) => 
    apiClient.get('/games/', { params: { category, ...params } }),

  // Add to favorites
  addFavorite: (gameId, userId = null) => 
    apiClient.post(`/games/${gameId}/favorite/`, { user_id: userId }),

  // Remove from favorites
  removeFavorite: (gameId, userId = null) => 
    apiClient.post(`/games/${gameId}/unfavorite/`, { user_id: userId }),

  // Increment play count
  incrementPlayCount: (gameId) => 
    apiClient.post(`/games/${gameId}/increment_play_count/`),

  // Submit rating for a game (each IP can only vote once)
  submitRating: (gameId, rating) => 
    apiClient.post(`/games/${gameId}/rate/`, { rating }),
}

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: () => 
    apiClient.get('/categories/'),

  // Get single category
  getCategory: (slug) => 
    apiClient.get(`/categories/${slug}/`),
}

export default apiClient
