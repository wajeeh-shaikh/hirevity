import { Settings, Shield, BarChart3, CreditCard, Users, Search } from 'lucide-react'

interface QuickActionsProps {
  userType: 'candidate' | 'recruiter'
  onAction: (action: string) => void
}

export function QuickActions({ userType, onAction }: QuickActionsProps) {
  const candidateActions = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: Settings,
      description: 'Update your personal information'
    },
    {
      id: 'privacy-settings',
      label: 'Privacy Settings',
      icon: Shield,
      description: 'Manage visibility and blocked companies'
    },
    {
      id: 'view-analytics',
      label: 'View Analytics',
      icon: BarChart3,
      description: 'See who viewed your profile'
    }
  ]

  const recruiterActions = [
    {
      id: 'search-candidates',
      label: 'Search Candidates',
      icon: Search,
      description: 'Find talent for your roles'
    },
    {
      id: 'manage-credits',
      label: 'Manage Credits',
      icon: CreditCard,
      description: 'Purchase more profile unlocks'
    },
    {
      id: 'team-settings',
      label: 'Team Settings',
      icon: Users,
      description: 'Manage team members and permissions'
    }
  ]

  const actions = userType === 'candidate' ? candidateActions : recruiterActions

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <div className="flex items-center">
              <action.icon className="h-5 w-5 text-gray-600 group-hover:text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-primary-900">
                  {action.label}
                </p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}