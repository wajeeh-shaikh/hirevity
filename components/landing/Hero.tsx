'use client'

import Link from 'next/link'
import { ArrowRight, Users, Search, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Talent
              <span className="text-primary-600 block">Matching Platform</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect exceptional talent with leading companies through intelligent matching. 
              Upload your resume, get discovered by top recruiters, or find your next hire with AI precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/register?type=candidate" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              <Users className="mr-2 h-5 w-5" />
              I'm Looking for Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/auth/register?type=recruiter" className="btn-secondary text-lg px-8 py-4 inline-flex items-center">
              <Search className="mr-2 h-5 w-5" />
              I'm Hiring Talent
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
              <p className="text-gray-600">Advanced algorithms match skills, experience, and preferences</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">Control your visibility and block unwanted companies</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">Find candidates with precise filters and match percentages</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}