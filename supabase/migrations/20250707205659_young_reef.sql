/*
  # Create profile views tracking table

  1. New Tables
    - `profile_views`
      - `id` (uuid, primary key)
      - `recruiter_id` (uuid, references profiles)
      - `candidate_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - Unique constraint on recruiter_id + candidate_id + date

  2. Security
    - Enable RLS on `profile_views` table
    - Add policy for recruiters to see their own views
    - Add policy for candidates to see their view stats
    - Add policy for recruiters to create new views
*/

CREATE TABLE IF NOT EXISTS profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(recruiter_id, candidate_id, DATE(created_at))
);

-- Enable Row Level Security
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Policy: Recruiters can see their own views
CREATE POLICY "Recruiters can view own profile views"
  ON profile_views
  FOR SELECT
  TO authenticated
  USING (recruiter_id = auth.uid());

-- Policy: Candidates can see their view stats
CREATE POLICY "Candidates can view their profile views"
  ON profile_views
  FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid());

-- Policy: Recruiters can create new views
CREATE POLICY "Recruiters can create profile views"
  ON profile_views
  FOR INSERT
  TO authenticated
  WITH CHECK (
    recruiter_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'recruiter'
    )
  );

-- Function to increment view counter when view is created
CREATE OR REPLACE FUNCTION increment_view_counter()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment candidate's views_count
  UPDATE profiles 
  SET views_count = views_count + 1
  WHERE id = NEW.candidate_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update view counter
CREATE TRIGGER increment_view_counter_trigger
  AFTER INSERT ON profile_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_view_counter();