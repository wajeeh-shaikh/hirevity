import { createBrowserClient } from '@supabase/ssr'

export const getSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login'
  }
}

export const redirectToDashboard = (userType: 'candidate' | 'recruiter') => {
  if (typeof window !== 'undefined') {
    const path = userType === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'
    window.location.href = path
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

export const formatAuthError = (error: any): string => {
  if (!error) return 'An unknown error occurred'
  
  const message = error.message || error.error_description || error.toString()
  
  // Common Supabase auth error messages
  const errorMappings: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please check your email and click the confirmation link',
    'User already registered': 'An account with this email already exists',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long',
    'Unable to validate email address: invalid format': 'Please enter a valid email address',
    'signup_disabled': 'Account registration is currently disabled',
  }
  
  return errorMappings[message] || message
}