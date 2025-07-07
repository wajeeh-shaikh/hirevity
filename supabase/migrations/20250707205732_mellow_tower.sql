/*
  # Create database indexes for performance

  1. Indexes
    - Skills array search optimization
    - Location text search
    - User type filtering
    - Experience range queries
    - Unlock tracking
    - View tracking

  2. Performance
    - Faster candidate search
    - Optimized filtering
    - Quick unlock checks
*/

-- Index for user type filtering (most common query)
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- Index for candidate visibility and blocking
CREATE INDEX IF NOT EXISTS idx_profiles_candidate_search 
ON profiles(user_type, is_hidden) 
WHERE user_type = 'candidate';

-- Index for skills array search using GIN
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);

-- Index for location search
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIN(to_tsvector('english', location));

-- Index for experience range queries
CREATE INDEX IF NOT EXISTS idx_profiles_experience ON profiles(experience_years);

-- Index for company blocking
CREATE INDEX IF NOT EXISTS idx_profiles_blocked_companies ON profiles USING GIN(blocked_companies);

-- Composite index for recruiter dashboard queries
CREATE INDEX IF NOT EXISTS idx_profiles_recruiter_search 
ON profiles(user_type, is_hidden, experience_years) 
WHERE user_type = 'candidate';

-- Index for profile unlocks lookup
CREATE INDEX IF NOT EXISTS idx_profile_unlocks_recruiter ON profile_unlocks(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_profile_unlocks_candidate ON profile_unlocks(candidate_id);
CREATE INDEX IF NOT EXISTS idx_profile_unlocks_lookup ON profile_unlocks(recruiter_id, candidate_id);

-- Index for profile views lookup
CREATE INDEX IF NOT EXISTS idx_profile_views_recruiter ON profile_views(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_candidate ON profile_views(candidate_id);

-- Index for timestamp queries
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profile_unlocks_created_at ON profile_unlocks(created_at);
CREATE INDEX IF NOT EXISTS idx_profile_views_created_at ON profile_views(created_at);