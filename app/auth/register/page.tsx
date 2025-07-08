'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, Users, ArrowLeft, UserCheck, Search } from 'lucide-react'

export default function RegisterPage() {
  const [userType, setUserType] = useState<'candidate' | 'recruiter'>('candidate')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'recruiter' || type === 'candidate') {
      setUserType(type)
    }
  }, [searchParams])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔄 Starting registration process...')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      console.log('🔄 Creating auth user...')
      
      // Step 1: Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
            company: userType === 'recruiter' ? company : null,
          }
        }
      })

      if (authError) {
        console.error('❌ Auth signup error:', authError)
        throw authError
      }

      console.log('✅ Auth user created:', authData.user?.id)

      if (authData.user) {
        console.log('🔄 Creating profile...')
        
        // Step 2: Create profile record
        const profileData = {
          id: authData.user.id,
          email: email,
          full_name: fullName,
          user_type: userType,
          company: userType === 'recruiter' ? company : null,
          credits_remaining: userType === 'recruiter' ? 50 : 0,
          unlocks_used: 0,
          views_count: 0,
          unlocks_count: 0,
          is_hidden: false,
          skills: [],
          blocked_companies: [],
          experience_years: 0,
          location: '',
          resume_parsed: false
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)

        if (profileError) {
          console.error('❌ Profile creation error:', profileError)
          throw new Error('Failed to create profile. Please try again.')
        }

        console.log('✅ Profile created successfully')

        // Step 3: Verify profile was created
        const { data: verifyProfile, error: verifyError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', authData.user.id)
          .single()
        
        if (verifyError || !verifyProfile) {
          console.error('❌ Profile verification failed:', verifyError)
          throw new Error('Profile verification failed')
        }
        
        console.log('✅ Profile verified:', verifyProfile)

        // Step 4: Refresh the auth state
        await supabase.auth.refreshSession()
        
        // Step 5: Wait a moment then redirect
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (verifyProfile.user_type === 'recruiter') {
          console.log('🔄 Redirecting to recruiter dashboard')
          router.push('/recruiter/dashboard')
        } else {
          console.log('🔄 Redirecting to candidate dashboard')
          router.push('/candidate/dashboard')
        }
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error)
      setError(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">TalentMatch</span>
        </Link>
        
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="label">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('candidate')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  userType === 'candidate'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <UserCheck className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Job Seeker</div>
                <div className="text-sm text-gray-500">Looking for opportunities</div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('recruiter')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  userType === 'recruiter'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Search className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Recruiter</div>
                <div className="text-sm text-gray-500">Hiring talent</div>
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="label">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            {userType === 'recruiter' && (
              <div>
                <label htmlFor="company" className="label">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="input-field"
                  placeholder="Enter your company name"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link href="/" className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}