interface SuccessMessageProps {
  message: string
  className?: string
}

export function SuccessMessage({ message, className = '' }: SuccessMessageProps) {
  return (
    <div className={`bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg ${className}`}>
      {message}
    </div>
  )
}