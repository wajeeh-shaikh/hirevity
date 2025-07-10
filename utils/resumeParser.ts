export interface ParsedResumeData {
  skills: string[]
  experience: number
  location: string
  education: string[]
  textLength: number
}

export const parseResumeWithAPI = async (
  userId: string, 
  resumeUrl: string
): Promise<ParsedResumeData> => {
  try {
    console.log('🔄 Calling resume parsing API...')
    
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        resumeUrl
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to parse resume')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Parsing failed')
    }

    console.log('✅ Resume parsed successfully:', result.data)
    return result.data

  } catch (error: any) {
    console.error('❌ Resume parsing error:', error)
    throw new Error(error.message || 'Failed to parse resume')
  }
}

export const validateResumeFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { isValid: false, error: 'Only PDF files are supported' }
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' }
  }

  // Check file name
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'File must have .pdf extension' }
  }

  return { isValid: true }
}

export const generateResumeFileName = (userId: string): string => {
  const timestamp = Date.now()
  return `${userId}/resume-${timestamp}.pdf`
}