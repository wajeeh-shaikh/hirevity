/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `full_name` (text, not null)
      - `user_type` (text, either 'candidate' or 'recruiter')
      - `company` (text, for recruiters)
      - `resume_url` (text, for candidates)
      - `skills` (text array, AI parsed skills)
      - `experience_years` (integer)
      - `location` (text)
      - `is_hidden` (boolean, candidate privacy control)
      - `blocked_companies` (text array, domains blocked by candidate)
      - `views_count` (integer, how many times profile viewed)
      - `unlocks_count` (integer, how many times profile unlocked)
      - `credits_remaining` (integer, for recruiters)
      - `unlocks_used` (integer, for recruiters this month)
      - `resume_parsed` (boolean, AI parsing status)
      - Timestamps for created_at and updated_at

  2. Security
    - Enable RLS on `profiles` table
    - Add policy for users to read/update their own profile
    - Add policy for recruiters to search visible candidate profiles
    - Add policy for candidates to hide from specific companies
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('candidate', 'recruiter')),
  company text,
  resume_url text,
  skills text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  location text DEFAULT '',
  is_hidden boolean DEFAULT false,
  blocked_companies text[] DEFAULT '{}',
  views_count integer DEFAULT 0,
  unlocks_count integer DEFAULT 0,
  credits_remaining integer DEFAULT 0,
  unlocks_used integer DEFAULT 0,
  resume_parsed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read, insert, and update their own profile
CREATE POLICY "Users can manage own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Recruiters can view visible candidate profiles (not hidden, not blocked)
CREATE POLICY "Recruiters can view available candidates"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    user_type = 'candidate' 
    AND is_hidden = false 
    AND (
      blocked_companies IS NULL 
      OR NOT EXISTS (
        SELECT 1 FROM profiles recruiter_profile 
        WHERE recruiter_profile.id = auth.uid() 
        AND recruiter_profile.user_type = 'recruiter'
        AND recruiter_profile.company = ANY(blocked_companies)
      )
    )
  );

-- Policy: Candidates can view recruiter profiles (for blocking purposes)
CREATE POLICY "Candidates can view recruiter companies"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    user_type = 'recruiter'
    AND EXISTS (
      SELECT 1 FROM profiles candidate_profile 
      WHERE candidate_profile.id = auth.uid() 
      AND candidate_profile.user_type = 'candidate'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();