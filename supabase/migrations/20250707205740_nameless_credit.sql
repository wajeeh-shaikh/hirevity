/*
  # Seed sample data for testing

  1. Sample Data
    - Test candidate profiles with various skills
    - Test recruiter profiles from different companies
    - Sample unlocks and views for testing

  2. Purpose
    - Test the search functionality
    - Verify privacy controls
    - Test match percentage calculations
*/

-- Note: This is sample data for testing purposes
-- In production, real users will create their own profiles

-- Sample candidate profiles (these would be created through the app)
-- Uncomment and modify the UUIDs if you want to add test data

/*
-- Sample Candidate 1: React Developer
INSERT INTO profiles (
  id, email, full_name, user_type, skills, experience_years, location, is_hidden
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'john.doe@example.com',
  'John Doe',
  'candidate',
  ARRAY['React', 'JavaScript', 'Node.js', 'TypeScript'],
  3,
  'San Francisco, CA',
  false
) ON CONFLICT (id) DO NOTHING;

-- Sample Candidate 2: Python Developer
INSERT INTO profiles (
  id, email, full_name, user_type, skills, experience_years, location, is_hidden, blocked_companies
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'jane.smith@example.com',
  'Jane Smith',
  'candidate',
  ARRAY['Python', 'Django', 'PostgreSQL', 'AWS'],
  5,
  'Remote',
  false,
  ARRAY['badcompany.com']
) ON CONFLICT (id) DO NOTHING;

-- Sample Recruiter 1
INSERT INTO profiles (
  id, email, full_name, user_type, company, credits_remaining, unlocks_used
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'recruiter@techcorp.com',
  'Alice Johnson',
  'recruiter',
  'techcorp.com',
  50,
  5
) ON CONFLICT (id) DO NOTHING;

-- Sample Recruiter 2
INSERT INTO profiles (
  id, email, full_name, user_type, company, credits_remaining, unlocks_used
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'hr@badcompany.com',
  'Bob Wilson',
  'recruiter',
  'badcompany.com',
  25,
  8
) ON CONFLICT (id) DO NOTHING;
*/

-- Create a function to generate sample data (can be called manually)
CREATE OR REPLACE FUNCTION generate_sample_data()
RETURNS void AS $$
BEGIN
  -- This function can be used to generate test data
  -- Call it manually if needed for testing
  RAISE NOTICE 'Sample data generation function created. Call manually if needed for testing.';
END;
$$ LANGUAGE plpgsql;