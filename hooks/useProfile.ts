import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'

interface Profile {
  id: string
  full_name: string
  email: string
  user_type: 'candidate' | 'recruiter'
  company?: string
  resume_url?: string
  skills?: string[]
  experience_years?: number
  location?: string
  is_hidden: boolean
  blocked_companies?: string[]
  views_count: number
  unlocks_count: number
  credits_remaining: number
  unlocks_used: number
  resume_parsed: boolean
}

export function useProfile() {
  const { user, supabase } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      
      setProfile(data)
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id)

      if (error) throw error
      
      setProfile(prev => prev ? { ...prev, ...updates } : null)
      return true
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message)
      return false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile
  }
}