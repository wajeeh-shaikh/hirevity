'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { validateResumeFile, parseResumeWithAPI, ParsedResumeData } from '@/utils/resumeParser'

interface ResumeUploadProps {
  userId: string
  onUploadSuccess: (data: ParsedResumeData) => void
  onUploadError: (error: string) => void
  supabase: any
  className?: string
}

export function ResumeUpload({
  userId,
  onUploadSuccess,
  onUploadError,
  supabase,
  className = ''
}: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setError('')
    setSuccess(false)
    
    const validation = validateResumeFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setSelectedFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      console.log('🔄 Starting file upload...')
      
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${userId}/resume-${Date.now()}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('❌ Upload error:', uploadError)
        throw new Error(uploadError.message)
      }

      console.log('✅ File uploaded:', uploadData)
      setUploadProgress(50)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      console.log('📄 Public URL:', publicUrl)
      setUploadProgress(70)

      // Update profile with resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: publicUrl })
        .eq('id', userId)

      if (updateError) {
        console.error('❌ Profile update error:', updateError)
        throw new Error('Failed to update profile')
      }

      setUploadProgress(80)
      setUploading(false)
      setParsing(true)

      console.log('🤖 Starting AI parsing...')
      
      // Parse resume with AI
      const parsedData = await parseResumeWithAPI(userId, publicUrl)
      
      setParsing(false)
      setSuccess(true)
      setUploadProgress(100)
      
      console.log('✅ Resume processing complete!')
      onUploadSuccess(parsedData)

    } catch (error: any) {
      console.error('❌ Upload/parsing error:', error)
      setError(error.message || 'Failed to process resume')
      onUploadError(error.message || 'Failed to process resume')
    } finally {
      setUploading(false)
      setParsing(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setError('')
    setSuccess(false)
    setUploadProgress(0)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const isProcessing = uploading || parsing

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : error
            ? 'border-red-300 bg-red-50'
            : success
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <File className="h-8 w-8 text-primary-600" />
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isProcessing && (
                <button
                  onClick={clearFile}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : parsing ? 'Parsing with AI...' : 'Processing...'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Resume processed successfully!</span>
              </div>
            )}

            {!isProcessing && !success && (
              <button
                onClick={handleUpload}
                className="btn-primary"
              >
                Upload & Parse Resume
              </button>
            )}
          </div>
        ) : (
          <div>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload your resume
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your PDF resume here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Our AI will automatically extract your skills, experience, and other details
            </p>
            <button
              type="button"
              className="btn-primary"
              disabled={isProcessing}
            >
              Choose PDF File
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  )
}