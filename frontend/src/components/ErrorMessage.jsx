import React from 'react'
import { AlertCircle } from 'lucide-react'

/**
 * ErrorMessage Component
 * Display error messages to user
 */
export default function ErrorMessage({ message, onRetry = null }) {
  return (
    <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-6 text-center">
      <div className="flex justify-center mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <p className="text-red-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
