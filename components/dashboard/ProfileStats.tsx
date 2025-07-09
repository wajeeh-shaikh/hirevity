import { Eye, FileText, Users, TrendingUp } from 'lucide-react'

interface ProfileStatsProps {
  stats: {
    views_count: number
    unlocks_count: number
    credits_remaining?: number
    unlocks_used?: number
  }
  userType: 'candidate' | 'recruiter'
}

export function ProfileStats({ stats, userType }: ProfileStatsProps) {
  const candidateStats = [
    {
      label: 'Profile Views',
      value: stats.views_count || 0,
      icon: Eye,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Resume Unlocks',
      value: stats.unlocks_count || 0,
      icon: FileText,
      color: 'text-green-600 bg-green-100'
    }
  ]

  const recruiterStats = [
    {
      label: 'Credits Remaining',
      value: stats.credits_remaining || 0,
      icon: TrendingUp,
      color: 'text-primary-600 bg-primary-100'
    },
    {
      label: 'Unlocks Used',
      value: stats.unlocks_used || 0,
      icon: Users,
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  const displayStats = userType === 'candidate' ? candidateStats : recruiterStats

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayStats.map((stat) => (
        <div key={stat.label} className="card">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}