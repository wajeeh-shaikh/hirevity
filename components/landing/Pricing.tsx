'use client'

import { Check, Star } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free Tier',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out the platform',
    features: [
      '10 profile unlocks per month',
      'Basic search filters',
      'Match percentage display',
      'Email support'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro Recruiter',
    price: '$99',
    period: 'per month',
    description: 'For active recruiting teams',
    features: [
      '100 profile unlocks per month',
      'Advanced search filters',
      'AI skill inference',
      'Priority support',
      'Team collaboration tools',
      'Analytics dashboard'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations',
    features: [
      'Unlimited profile unlocks',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced analytics',
      'API access',
      'Custom branding'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your hiring needs. Always free for job seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`card relative ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register?type=recruiter"
                className={`w-full text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            <strong>Always free for job seekers!</strong> Upload your resume and get discovered by top companies.
          </p>
          <Link href="/auth/register?type=candidate" className="btn-primary">
            Join as Job Seeker
          </Link>
        </div>
      </div>
    </section>
  )
}