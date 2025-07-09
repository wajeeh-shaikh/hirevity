interface SkillTagProps {
  skill: string
  onRemove?: () => void
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md'
}

export function SkillTag({ 
  skill, 
  onRemove, 
  variant = 'default',
  size = 'md'
}: SkillTagProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
    secondary: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium transition-colors ${variants[variant]} ${sizes[size]}`}>
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 hover:text-red-600 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  )
}