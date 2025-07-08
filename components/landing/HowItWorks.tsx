'use client'

import { Upload, Brain, Search, Unlock } from 'lucide-react'

const candidateSteps = [
  {
    icon: Upload,
    title: 'Upload Resume',
    description: 'Upload your PDF resume and let our AI parse your skills and experience'
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our AI creates an optimized profile and suggests improvements'
  },
  {
    icon: Search,
    title: 'Get Discovered',
    description: 'Recruiters find you through intelligent matching algorithms'
  }
]

const recruiterSteps = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Use advanced filters to find candidates matching your requirements'
  },
  {
    icon: Brain,
    title: 'AI Matching',
    description: 'Get match percentages and see why candidates fit your role'
  },
  {
    icon: Unlock,
    title: 'Unlock Profiles',
    description: 'Access full resumes and contact information with credits'
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How TalentMatch Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to connect talent with opportunity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* For Candidates */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Job Seekers</h3>
            <div className="space-y-8">
              {candidateSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Recruiters</h3>
            <div className="space-y-8">
              {recruiterSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}