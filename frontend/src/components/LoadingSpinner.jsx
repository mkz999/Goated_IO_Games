import React from 'react'
import { Loader } from 'lucide-react'

/**
 * LoadingSpinner Component
 * Show loading state while fetching data
 */
export default function LoadingSpinner({ message = 'Loading games...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16 mb-4">
        <Loader className="w-16 h-16 text-primary animate-spin" />
      </div>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  )
}
