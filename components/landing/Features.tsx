'use client'

import { Shield, Brain, Filter, Eye, CreditCard, Globe } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Resume Parsing',
    description: 'Automatically extract skills, experience, and qualifications from uploaded resumes with high accuracy.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Shield,
    title: 'Privacy Controls',
    description: 'Hide your identity, block specific companies, and control who can see your profile.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Filter,
    title: 'Advanced Filtering',
    description: 'Search by tech stack, experience, location, education, and more with intelligent matching.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Eye,
    title: 'Profile Analytics',
    description: 'Track how many recruiters viewed and unlocked your profile with detailed insights.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: CreditCard,
    title: 'Flexible Pricing',
    description: 'Free tier with 10 unlocks, then pay-as-you-go credits for additional profile access.',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with talent and opportunities worldwide with location-based filtering.',
    color: 'bg-indigo-100 text-indigo-600'
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Recruitment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to find the perfect match between talent and opportunity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}