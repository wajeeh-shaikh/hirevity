# TalentMatch - AI-Powered Recruitment Platform

A modern talent marketplace platform that connects job seekers with recruiters through AI-powered matching.

## Features

### For Job Seekers (Candidates)
- ✅ Upload PDF resume with AI parsing
- ✅ Auto-generated profile with skills extraction
- ✅ Privacy controls (hide/show profile)
- ✅ Block specific companies
- ✅ Track profile views and unlocks
- ✅ Dashboard with analytics

### For Recruiters
- ✅ Advanced search with filters (tech stack, location, experience)
- ✅ AI-powered candidate matching with percentages
- ✅ Freemium model (10 free unlocks/month)
- ✅ Credit system for additional unlocks
- ✅ View anonymized profiles before unlocking
- ✅ Full contact access after unlock

### Platform Features
- ✅ AI resume parsing and skill inference
- ✅ Match percentage calculator
- ✅ Responsive design with Tailwind CSS
- ✅ Authentication with Supabase
- ✅ File storage for resumes
- ✅ Real-time updates

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI/ML**: Supabase Edge Functions for resume parsing
- **Deployment**: Vercel (Frontend), Supabase (Backend)
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd talentmatch-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The platform requires the following Supabase tables:

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('candidate', 'recruiter')),
  company TEXT,
  resume_url TEXT,
  skills TEXT[],
  experience_years INTEGER,
  location TEXT,
  is_hidden BOOLEAN DEFAULT false,
  blocked_companies TEXT[],
  views_count INTEGER DEFAULT 0,
  unlocks_count INTEGER DEFAULT 0,
  credits_remaining INTEGER DEFAULT 0,
  unlocks_used INTEGER DEFAULT 0,
  resume_parsed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Profile Unlocks Table
```sql
CREATE TABLE profile_unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID REFERENCES profiles(id) NOT NULL,
  candidate_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recruiter_id, candidate_id)
);
```

### Storage Bucket
Create a storage bucket named `resumes` for PDF file uploads.

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Supabase)
1. Create a new Supabase project
2. Run the SQL migrations
3. Set up storage bucket
4. Deploy edge functions for AI parsing

## Features Roadmap

### Phase 1 (MVP) ✅
- Basic authentication and profiles
- Resume upload and parsing
- Search and filtering
- Freemium unlock system

### Phase 2 (Enhancements)
- Advanced AI matching algorithms
- Email notifications
- Team collaboration for recruiters
- Analytics dashboard
- Mobile app

### Phase 3 (Scale)
- API for integrations
- Enterprise features
- Advanced reporting
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email hello@talentmatch.com or create an issue in the repository.