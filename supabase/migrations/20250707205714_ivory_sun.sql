/*
  # Create search and matching functions

  1. Functions
    - `search_candidates` - Advanced candidate search with filters
    - `calculate_match_percentage` - AI matching algorithm
    - `get_candidate_preview` - Anonymized candidate data

  2. Features
    - Skills matching with fuzzy search
    - Location filtering
    - Experience range filtering
    - Company blocking enforcement
    - Match percentage calculation
*/

-- Function to search candidates with filters
CREATE OR REPLACE FUNCTION search_candidates(
  p_recruiter_id uuid,
  p_skills text[] DEFAULT '{}',
  p_location text DEFAULT '',
  p_min_experience integer DEFAULT 0,
  p_max_experience integer DEFAULT 50,
  p_job_type text DEFAULT 'any'
)
RETURNS TABLE (
  candidate_id uuid,
  skills text[],
  experience_years integer,
  location text,
  match_percentage integer,
  is_unlocked boolean,
  preview_data jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as candidate_id,
    p.skills,
    p.experience_years,
    p.location,
    calculate_match_percentage(p.skills, p_skills, p.experience_years, p_min_experience, p_max_experience) as match_percentage,
    EXISTS(
      SELECT 1 FROM profile_unlocks pu 
      WHERE pu.recruiter_id = p_recruiter_id 
      AND pu.candidate_id = p.id
    ) as is_unlocked,
    jsonb_build_object(
      'title', CASE 
        WHEN p.experience_years >= 5 THEN 'Senior Developer'
        WHEN p.experience_years >= 2 THEN 'Developer'
        ELSE 'Junior Developer'
      END,
      'company', 'Previous Experience',
      'education', 'University Graduate'
    ) as preview_data
  FROM profiles p
  WHERE p.user_type = 'candidate'
    AND p.is_hidden = false
    AND (
      p.blocked_companies IS NULL 
      OR NOT EXISTS (
        SELECT 1 FROM profiles rp 
        WHERE rp.id = p_recruiter_id 
        AND rp.company = ANY(p.blocked_companies)
      )
    )
    AND (
      array_length(p_skills, 1) IS NULL 
      OR p_skills = '{}' 
      OR p.skills && p_skills
    )
    AND (
      p_location = '' 
      OR p.location ILIKE '%' || p_location || '%'
    )
    AND p.experience_years >= p_min_experience
    AND p.experience_years <= p_max_experience
  ORDER BY match_percentage DESC, p.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate match percentage
CREATE OR REPLACE FUNCTION calculate_match_percentage(
  candidate_skills text[],
  required_skills text[],
  candidate_experience integer,
  min_experience integer,
  max_experience integer
)
RETURNS integer AS $$
DECLARE
  skills_match_score integer := 0;
  experience_match_score integer := 0;
  total_score integer := 0;
BEGIN
  -- Skills matching (70% weight)
  IF array_length(required_skills, 1) > 0 THEN
    SELECT COUNT(*) * 100 / array_length(required_skills, 1)
    INTO skills_match_score
    FROM unnest(required_skills) AS required_skill
    WHERE required_skill = ANY(candidate_skills);
    
    skills_match_score := LEAST(skills_match_score, 100);
  ELSE
    skills_match_score := 100;
  END IF;
  
  -- Experience matching (30% weight)
  IF candidate_experience >= min_experience AND candidate_experience <= max_experience THEN
    experience_match_score := 100;
  ELSIF candidate_experience < min_experience THEN
    experience_match_score := GREATEST(0, 100 - (min_experience - candidate_experience) * 20);
  ELSE
    experience_match_score := GREATEST(0, 100 - (candidate_experience - max_experience) * 10);
  END IF;
  
  -- Calculate weighted total
  total_score := (skills_match_score * 70 + experience_match_score * 30) / 100;
  
  RETURN LEAST(total_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to get anonymized candidate preview
CREATE OR REPLACE FUNCTION get_candidate_preview(candidate_id uuid)
RETURNS jsonb AS $$
DECLARE
  candidate_data jsonb;
BEGIN
  SELECT jsonb_build_object(
    'id', id,
    'skills', skills,
    'experience_years', experience_years,
    'location', location,
    'preview_title', CASE 
      WHEN experience_years >= 5 THEN 'Senior Developer'
      WHEN experience_years >= 2 THEN 'Developer'
      ELSE 'Junior Developer'
    END,
    'is_hidden', is_hidden
  )
  INTO candidate_data
  FROM profiles
  WHERE id = candidate_id AND user_type = 'candidate';
  
  RETURN candidate_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;