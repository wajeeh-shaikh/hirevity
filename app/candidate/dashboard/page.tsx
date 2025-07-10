'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { Eye, EyeOff, Shield, BarChart3, Settings, FileText, Users, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ResumeUpload } from '@/components/ui/ResumeUpload'
import { ParsedResumeData } from '@/utils/resumeParser'

interface Profile {
  id: string
  full_name: string
  email: string
  resume_url?: string
  skills?: string[]
  experience_years?: number
  location?: string
  is_hidden: boolean
  blocked_companies?: string[]
  views_count: number
  unlocks_count: number
}

export default function CandidateDashboard() {
  const { user, loading: authLoading, signOut, supabase } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      console.log('🔄 Fetching candidate profile...')
      fetchProfile()
    } else if (!authLoading) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) {
        console.error('❌ Error fetching profile:', error)
        throw error
      }
      
      console.log('✅ Profile fetched:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (data: ParsedResumeData) => {
    console.log('✅ Resume upload successful:', data)
    setUploadSuccess(true)
    setUploadError('')
    fetchProfile() // Refresh profile data
  }

  const handleUploadError = (error: string) => {
    console.error('❌ Resume upload failed:', error)
    setUploadError(error)
    setUploadSuccess(false)
  }

  const toggleVisibility = async () => {
    if (!profile) return

    try {
      console.log('🔄 Toggling profile visibility...')
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_hidden: !profile.is_hidden })
        .eq('id', user?.id)

      if (error) throw error
      
      setProfile({ ...profile, is_hidden: !profile.is_hidden })
      console.log('✅ Visibility updated')
    } catch (error) {
      console.error('Error updating visibility:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
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
              <span className="text-gray-700">Welcome, {profile?.full_name}</span>
              <button 
                onClick={handleSignOut}
                className="btn-secondary flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Upload */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume</h2>
              {profile?.resume_url ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">Resume uploaded</p>
                      <p className="text-sm text-green-700">
                        {profile.resume_parsed ? 'AI parsing completed' : 'Processing...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      View
                    </a>
                    <div>
                      <ResumeUpload
                        userId={user?.id || ''}
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        supabase={supabase}
                        className="inline-block"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <ResumeUpload
                  userId={user?.id || ''}
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                  supabase={supabase}
                />
              )}
              
              {uploadSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ Resume uploaded and parsed successfully! Your profile has been updated.
                  </p>
                </div>
              )}
              
              {uploadError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    ❌ {uploadError}
                  </p>
                </div>
              )}
            </div>

            {/* AI Parsed Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Parsed Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Controls */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Controls</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 text-gray-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Profile Visibility</p>
                      <p className="text-sm text-gray-600">
                        {profile?.is_hidden ? 'Hidden from recruiters' : 'Visible to recruiters'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleVisibility}
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      profile?.is_hidden
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {profile?.is_hidden ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hidden
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Visible
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-gray-700">Profile Views</span>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">{profile?.views_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-gray-700">Resume Unlocks</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{profile?.unlocks_count || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn-secondary text-left">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
                <button className="w-full btn-secondary text-left">
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Blocked Companies
                </button>
                <button className="w-full btn-secondary text-left">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}