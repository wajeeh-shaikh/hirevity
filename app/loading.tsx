import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 mt-4">Loading...</p>
    </div>
  )
}