/*
  # Create profile unlocks tracking table

  1. New Tables
    - `profile_unlocks`
      - `id` (uuid, primary key)
      - `recruiter_id` (uuid, references profiles)
      - `candidate_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - Unique constraint on recruiter_id + candidate_id

  2. Security
    - Enable RLS on `profile_unlocks` table
    - Add policy for recruiters to see their own unlocks
    - Add policy for candidates to see who unlocked them
    - Add policy for recruiters to create new unlocks
*/

CREATE TABLE IF NOT EXISTS profile_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(recruiter_id, candidate_id)
);

-- Enable Row Level Security
ALTER TABLE profile_unlocks ENABLE ROW LEVEL SECURITY;

-- Policy: Recruiters can see their own unlocks
CREATE POLICY "Recruiters can view own unlocks"
  ON profile_unlocks
  FOR SELECT
  TO authenticated
  USING (recruiter_id = auth.uid());

-- Policy: Candidates can see who unlocked them
CREATE POLICY "Candidates can view their unlocks"
  ON profile_unlocks
  FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid());

-- Policy: Recruiters can create new unlocks
CREATE POLICY "Recruiters can create unlocks"
  ON profile_unlocks
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

-- Function to increment unlock counters when unlock is created
CREATE OR REPLACE FUNCTION increment_unlock_counters()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment candidate's unlocks_count
  UPDATE profiles 
  SET unlocks_count = unlocks_count + 1
  WHERE id = NEW.candidate_id;
  
  -- Increment recruiter's unlocks_used
  UPDATE profiles 
  SET unlocks_used = unlocks_used + 1
  WHERE id = NEW.recruiter_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update counters
CREATE TRIGGER increment_unlock_counters_trigger
  AFTER INSERT ON profile_unlocks
  FOR EACH ROW
  EXECUTE FUNCTION increment_unlock_counters();