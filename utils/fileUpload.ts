import { SUPABASE_STORAGE_BUCKET } from './constants'

export const validateFile = (file: File) => {
  const errors: string[] = []
  
  // Check file type
  if (file.type !== 'application/pdf') {
    errors.push('Only PDF files are allowed')
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    errors.push('File size must be less than 5MB')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const generateFileName = (userId: string, originalName: string) => {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()
  return `${userId}/${timestamp}.${extension}`
}

export const uploadFile = async (
  supabase: any,
  file: File,
  fileName: string
) => {
  try {
    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(fileName)

    return {
      success: true,
      data: {
        path: data.path,
        publicUrl
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const deleteFile = async (
  supabase: any,
  fileName: string
) => {
  try {
    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove([fileName])

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}