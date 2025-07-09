interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg ${className}`}>
      {message}
    </div>
  )
}