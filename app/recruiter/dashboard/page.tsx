'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { createBrowserClient } from '@supabase/ssr'
import { Search, Filter, Users, CreditCard, Eye, Unlock, MapPin, Calendar, Star } from 'lucide-react'
import Link from 'next/link'

interface Candidate {
  id: string
  full_name: string
  skills: string[]
  experience_years: number
  location: string
  match_percentage: number
  is_unlocked: boolean
  preview_data: {
    title: string
    company: string
    education: string
  }
}

interface RecruiterProfile {
  id: string
  full_name: string
  company: string
  credits_remaining: number
  unlocks_used: number
}

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<RecruiterProfile | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    skills: '',
    location: '',
    experience: '',
    jobType: 'any'
  })
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (user) {
      fetchProfile()
      searchCandidates()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const searchCandidates = async () => {
    try {
      setLoading(true)
      
      // This would be a more complex query in a real app
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'candidate')
        .eq('is_hidden', false)
        .limit(20)

      if (error) throw error

      // Mock data for demonstration
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          full_name: 'Sarah Johnson',
          skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
          experience_years: 5,
          location: 'San Francisco, CA',
          match_percentage: 95,
          is_unlocked: false,
          preview_data: {
            title: 'Senior Frontend Developer',
            company: 'Ex-Google',
            education: 'Stanford University'
          }
        },
        {
          id: '2',
          full_name: 'Michael Chen',
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
          experience_years: 3,
          location: 'Remote',
          match_percentage: 88,
          is_unlocked: false,
          preview_data: {
            title: 'Backend Developer',
            company: 'Ex-Microsoft',
            education: 'MIT'
          }
        },
        {
          id: '3',
          full_name: 'Emily Rodriguez',
          skills: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
          experience_years: 4,
          location: 'Austin, TX',
          match_percentage: 82,
          is_unlocked: true,
          preview_data: {
            title: 'Full Stack Developer',
            company: 'Ex-Amazon',
            education: 'UC Berkeley'
          }
        }
      ]

      setCandidates(mockCandidates)
    } catch (error) {
      console.error('Error searching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const unlockProfile = async (candidateId: string) => {
    try {
      // Check if user has credits
      if (profile && profile.unlocks_used >= 10 && profile.credits_remaining <= 0) {
        alert('You need to purchase more credits to unlock this profile')
        return
      }

      // Unlock the profile
      const { error } = await supabase
        .from('profile_unlocks')
        .insert({
          recruiter_id: user?.id,
          candidate_id: candidateId
        })

      if (error) throw error

      // Update local state
      setCandidates(candidates.map(c => 
        c.id === candidateId ? { ...c, is_unlocked: true } : c
      ))

      // Update recruiter stats
      if (profile) {
        setProfile({
          ...profile,
          unlocks_used: profile.unlocks_used + 1,
          credits_remaining: profile.unlocks_used >= 10 ? profile.credits_remaining - 1 : profile.credits_remaining
        })
      }
    } catch (error) {
      console.error('Error unlocking profile:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">TalentMatch</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span>Credits: {profile?.credits_remaining || 0}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                <span>Used: {profile?.unlocks_used || 0}/10</span>
              </div>
              <span className="text-gray-700">Welcome, {profile?.full_name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Filters */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search Filters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Tech Stack</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Python..."
                    value={searchFilters.skills}
                    onChange={(e) => setSearchFilters({...searchFilters, skills: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    placeholder="San Francisco, Remote..."
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Experience</label>
                  <select
                    value={searchFilters.experience}
                    onChange={(e) => setSearchFilters({...searchFilters, experience: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Any experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="label">Job Type</label>
                  <select
                    value={searchFilters.jobType}
                    onChange={(e) => setSearchFilters({...searchFilters, jobType: e.target.value})}
                    className="input-field"
                  >
                    <option value="any">Any</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>

                <button
                  onClick={searchCandidates}
                  className="w-full btn-primary"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Candidates
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Candidate Search</h1>
              <p className="text-gray-600">Found {candidates.length} matching candidates</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {candidate.is_unlocked ? candidate.full_name : 'Anonymous Candidate'}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              candidate.match_percentage >= 90 ? 'bg-green-100 text-green-800' :
                              candidate.match_percentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {candidate.match_percentage}% Match
                            </div>
                            {candidate.match_percentage >= 90 && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{candidate.experience_years} years experience</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{candidate.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{candidate.preview_data.company}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {candidate.is_unlocked && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 font-medium">Profile Unlocked</p>
                            <p className="text-sm text-green-700">
                              Contact: {candidate.full_name.toLowerCase().replace(' ', '.')}@email.com
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 flex flex-col space-y-2">
                        {!candidate.is_unlocked ? (
                          <button
                            onClick={() => unlockProfile(candidate.id)}
                            className="btn-primary flex items-center"
                          >
                            <Unlock className="h-4 w-4 mr-2" />
                            Unlock Profile
                            <span className="ml-2 text-xs">
                              {profile && profile.unlocks_used < 10 ? 'Free' : '1 Credit'}
                            </span>
                          </button>
                        ) : (
                          <div className="text-center">
                            <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                              ✓ Unlocked
                            </div>
                          </div>
                        )}
                        
                        <button className="btn-secondary text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}