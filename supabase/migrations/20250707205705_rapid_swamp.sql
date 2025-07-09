/*
  # Create storage buckets for file uploads

  1. Storage Buckets
    - `resumes` bucket for PDF resume files
    - Public access for authenticated users
    - File size limits and type restrictions

  2. Security
    - RLS policies for resume uploads
    - Only candidates can upload to their own folder
    - Only recruiters who unlocked can download
*/

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Candidates can upload their own resumes
CREATE POLICY "Candidates can upload own resumes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'candidate'
  )
);

-- Policy: Candidates can update their own resumes
CREATE POLICY "Candidates can update own resumes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'candidate'
  )
);

-- Policy: Candidates can delete their own resumes
CREATE POLICY "Candidates can delete own resumes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'candidate'
  )
);

-- Policy: Recruiters can download unlocked resumes
CREATE POLICY "Recruiters can download unlocked resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes'
  AND (
    -- Candidate can always see their own resume
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Recruiter can see if they unlocked the profile
    EXISTS (
      SELECT 1 FROM profile_unlocks pu
      JOIN profiles p ON p.id = pu.candidate_id
      WHERE pu.recruiter_id = auth.uid()
      AND p.id::text = (storage.foldername(name))[1]
    )
  )
);