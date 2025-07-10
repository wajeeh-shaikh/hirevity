'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        
        <button
          onClick={reset}
          className="btn-primary inline-flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </button>
      </div>
    </div>
  )
}