'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { createBrowserClient } from '@supabase/ssr'
import { Upload, Eye, EyeOff, Shield, BarChart3, Settings, FileText, Users } from 'lucide-react'
import Link from 'next/link'

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
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (user) {
      console.log('🔄 Fetching candidate profile...')
      fetchProfile()
    }
  }, [user])

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    setUploading(true)
    try {
      console.log('🔄 Uploading resume...')
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file)

      if (uploadError) {
        console.error('❌ Upload error:', uploadError)
        throw uploadError
      }

      console.log('✅ File uploaded:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      console.log('📄 Public URL:', publicUrl)

      // Update profile with resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: publicUrl })
        .eq('id', user?.id)

      if (updateError) {
        console.error('❌ Profile update error:', updateError)
        throw updateError
      }

      console.log('✅ Profile updated with resume URL')

      // Trigger AI parsing (this would be handled by an edge function)
      try {
        await supabase.functions.invoke('parse-resume', {
          body: { userId: user?.id, resumeUrl: publicUrl }
        })
        console.log('🤖 AI parsing triggered')
      } catch (parseError) {
        console.log('⚠️ AI parsing not available yet')
      }

      fetchProfile()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setUploading(false)
    }
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
              <button className="btn-secondary">
                <Settings className="h-4 w-4 mr-2" />
                Settings
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
                      <p className="text-sm text-green-700">AI parsing completed</p>
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
                    <label className="btn-primary text-sm cursor-pointer">
                      Replace
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your resume</h3>
                  <p className="text-gray-600 mb-4">PDF format only. Our AI will parse your skills and experience.</p>
                  <label className="btn-primary cursor-pointer">
                    {uploading ? 'Uploading...' : 'Choose PDF file'}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
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