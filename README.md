# TalentMatch - AI-Powered Recruitment Platform

A modern talent marketplace platform that connects job seekers with recruiters through AI-powered matching.

## 🚀 Features

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
- ✅ Protected routes with middleware
- ✅ Error handling and loading states

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (Frontend), Supabase (Backend)
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React

## 🏃‍♂️ Getting Started

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

## 📊 Database Setup

The platform uses Supabase with the following main tables:

- **profiles**: User profiles for both candidates and recruiters
- **profile_unlocks**: Tracks which recruiters unlocked which candidates
- **profile_views**: Tracks profile view analytics

Run the migrations in the `supabase/migrations` folder to set up your database.

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Supabase)
1. Create a new Supabase project
2. Run the SQL migrations
3. Set up storage bucket for resumes

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── candidate/         # Candidate dashboard
│   ├── recruiter/         # Recruiter dashboard
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── landing/          # Landing page components
│   ├── ui/               # UI components
│   └── dashboard/        # Dashboard components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── supabase/             # Database migrations
└── middleware.ts         # Next.js middleware
```

## 🔐 Authentication Flow

1. Users register as either candidates or recruiters
2. Email/password authentication via Supabase
3. Profile creation with user type
4. Protected routes based on authentication status
5. Role-based redirects to appropriate dashboards

## 💳 Pricing Model

- **Candidates**: Always free
- **Recruiters**: 
  - 10 free profile unlocks per month
  - Additional unlocks via credit system
  - Premium features for enterprise

## 🛡 Security Features

- Row Level Security (RLS) on all database tables
- Protected API routes
- File upload validation
- Input sanitization
- CSRF protection via Supabase

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- Server-side rendering with Next.js
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email hello@talentmatch.com or create an issue in the repository.

## 🗺 Roadmap

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