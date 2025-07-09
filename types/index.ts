export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
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
  created_at: string
  updated_at: string
}

export interface Candidate {
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

export interface ProfileUnlock {
  id: string
  recruiter_id: string
  candidate_id: string
  created_at: string
}

export interface ProfileView {
  id: string
  recruiter_id: string
  candidate_id: string
  created_at: string
}

export interface SearchFilters {
  skills: string
  location: string
  experience: string
  jobType: 'any' | 'remote' | 'hybrid' | 'onsite'
}

export interface FileUploadResult {
  success: boolean
  data?: {
    path: string
    publicUrl: string
  }
  error?: string
}

export interface MatchResult {
  percentage: number
  color: string
  label: string
}