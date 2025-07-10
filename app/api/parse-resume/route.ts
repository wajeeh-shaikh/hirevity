import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import pdf from 'pdf-parse'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, resumeUrl } = await request.json()

    if (!userId || !resumeUrl) {
      return NextResponse.json(
        { error: 'Missing userId or resumeUrl' },
        { status: 400 }
      )
    }

    console.log('🔄 Starting resume parsing for user:', userId)

    // Fetch the PDF file
    const response = await fetch(resumeUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse PDF content
    const pdfData = await pdf(buffer)
    const text = pdfData.text

    console.log('📄 PDF text extracted, length:', text.length)

    // Extract information using AI parsing
    const skills = extractSkills(text)
    const experience = extractExperience(text)
    const location = extractLocation(text)
    const education = extractEducation(text)

    console.log('🤖 Parsed data:', { skills, experience, location, education })

    // Update the user's profile with parsed data
    const { error } = await supabase
      .from('profiles')
      .update({
        skills: skills,
        experience_years: experience,
        location: location,
        resume_parsed: true
      })
      .eq('id', userId)

    if (error) {
      console.error('❌ Database update error:', error)
      throw error
    }

    console.log('✅ Profile updated successfully')

    return NextResponse.json({
      success: true,
      data: {
        skills,
        experience,
        location,
        education,
        textLength: text.length
      }
    })

  } catch (error: any) {
    console.error('❌ Resume parsing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to parse resume' },
      { status: 500 }
    )
  }
}

function extractSkills(text: string): string[] {
  const skillsDatabase = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell', 'Bash', 'PowerShell',
    
    // Frontend Frameworks/Libraries
    'React', 'Vue.js', 'Vue', 'Angular', 'Svelte', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI', 'Styled Components',
    
    // Backend Frameworks
    'Node.js', 'Express.js', 'Express', 'Next.js', 'Nuxt.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Spring', 'Laravel', 'Symfony', 'Ruby on Rails', 'ASP.NET', '.NET Core',
    
    // Databases
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Oracle', 'SQL Server', 'DynamoDB', 'Cassandra', 'Neo4j', 'InfluxDB',
    
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet',
    
    // Tools & Technologies
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'Trello', 'Asana', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
    
    // Testing
    'Jest', 'Cypress', 'Selenium', 'Mocha', 'Chai', 'Jasmine', 'Karma', 'Puppeteer', 'Playwright', 'TestNG', 'JUnit', 'PyTest',
    
    // Mobile Development
    'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Swift', 'Objective-C', 'Kotlin', 'Java Android',
    
    // Data & Analytics
    'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'Apache Spark', 'Hadoop', 'Tableau', 'Power BI',
    
    // Web Technologies
    'HTML', 'CSS', 'SASS', 'SCSS', 'Less', 'Webpack', 'Vite', 'Rollup', 'Parcel', 'Babel', 'ESLint', 'Prettier',
    
    // API & Integration
    'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'Socket.io', 'Microservices', 'API Gateway', 'OAuth', 'JWT',
    
    // Methodologies
    'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'Microservices Architecture', 'Event-driven Architecture'
  ]

  const foundSkills = new Set<string>()
  const lowerText = text.toLowerCase()

  // Look for skills in the text
  skillsDatabase.forEach(skill => {
    const variations = [
      skill.toLowerCase(),
      skill.toLowerCase().replace(/\./g, ''),
      skill.toLowerCase().replace(/\s/g, ''),
      skill.toLowerCase().replace(/-/g, ''),
    ]

    variations.forEach(variation => {
      if (lowerText.includes(variation)) {
        foundSkills.add(skill)
      }
    })
  })

  // Look for skills in dedicated sections
  const skillsSections = text.match(/(?:skills|technologies|technical skills|programming languages|tools)[:\s]*([^]*?)(?:\n\s*\n|$)/gi)
  if (skillsSections) {
    skillsSections.forEach(section => {
      skillsDatabase.forEach(skill => {
        if (section.toLowerCase().includes(skill.toLowerCase())) {
          foundSkills.add(skill)
        }
      })
    })
  }

  return Array.from(foundSkills).slice(0, 15) // Limit to 15 skills
}

function extractExperience(text: string): number {
  const experiencePatterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
    /(?:experience|exp)[:\s]*(\d+)\+?\s*years?/gi,
    /(\d+)\+?\s*yrs?\s*(?:of\s*)?(?:experience|exp)/gi,
    /(?:total|overall)\s*(?:experience|exp)[:\s]*(\d+)\+?\s*years?/gi
  ]

  let maxExperience = 0

  experiencePatterns.forEach(pattern => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const years = parseInt(match[1])
      if (years > maxExperience && years <= 50) {
        maxExperience = years
      }
    }
  })

  // If no explicit experience found, try to calculate from work history
  if (maxExperience === 0) {
    const workHistory = extractWorkHistory(text)
    maxExperience = workHistory
  }

  return Math.min(maxExperience, 50) // Cap at 50 years
}

function extractWorkHistory(text: string): number {
  const datePatterns = [
    /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/gi,
    /(\d{4})\s*[-–—]\s*(\d{4})/gi,
    /(?:from\s*)?(\d{4})\s*(?:to\s*)?(\d{4}|present|current)/gi
  ]

  const workPeriods: Array<{ start: number; end: number }> = []
  const currentYear = new Date().getFullYear()

  datePatterns.forEach(pattern => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const startYear = parseInt(match[1])
      const endYear = match[2].toLowerCase().includes('present') || match[2].toLowerCase().includes('current') 
        ? currentYear 
        : parseInt(match[2])

      if (startYear >= 1990 && startYear <= currentYear && endYear >= startYear && endYear <= currentYear) {
        workPeriods.push({ start: startYear, end: endYear })
      }
    }
  })

  if (workPeriods.length === 0) return 0

  // Calculate total experience (handling overlaps)
  workPeriods.sort((a, b) => a.start - b.start)
  
  let totalExperience = 0
  let lastEnd = 0

  workPeriods.forEach(period => {
    const start = Math.max(period.start, lastEnd)
    if (period.end > start) {
      totalExperience += period.end - start
      lastEnd = period.end
    }
  })

  return Math.min(totalExperience, 50)
}

function extractLocation(text: string): string {
  const commonLocations = [
    'San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Austin', 'Seattle', 'Boston', 'Denver',
    'Atlanta', 'Miami', 'Dallas', 'Phoenix', 'Philadelphia', 'Houston', 'Washington DC', 'Portland',
    'Nashville', 'Raleigh', 'Salt Lake City', 'Remote', 'United States', 'USA', 'Canada', 'UK',
    'London', 'Toronto', 'Vancouver', 'Berlin', 'Amsterdam', 'Paris', 'Sydney', 'Melbourne',
    'Singapore', 'Tokyo', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'
  ]

  // Look for location patterns
  const locationPatterns = [
    /(?:location|address|based in|located in)[:\s]*([^,\n]+)/gi,
    /([^,\n]+),\s*(?:CA|NY|TX|FL|WA|IL|MA|CO|GA|AZ|PA|OR|NC|UT|USA|US)/gi,
    /(?:city|state)[:\s]*([^,\n]+)/gi
  ]

  for (const pattern of locationPatterns) {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const location = match[1].trim()
      if (location.length > 2 && location.length < 50) {
        return location
      }
    }
  }

  // Check for common locations
  for (const location of commonLocations) {
    if (text.toLowerCase().includes(location.toLowerCase())) {
      return location
    }
  }

  return 'Remote'
}

function extractEducation(text: string): string[] {
  const degrees = [
    'Bachelor', 'Master', 'PhD', 'Doctorate', 'Associate', 'Diploma', 'Certificate',
    'B.S.', 'B.A.', 'M.S.', 'M.A.', 'MBA', 'B.Tech', 'M.Tech', 'B.E.', 'M.E.'
  ]

  const universities = [
    'University', 'College', 'Institute', 'School', 'Academy', 'MIT', 'Stanford',
    'Harvard', 'Berkeley', 'UCLA', 'Caltech', 'Carnegie Mellon', 'Georgia Tech'
  ]

  const education: string[] = []

  degrees.forEach(degree => {
    const pattern = new RegExp(`${degree}[^\\n]*`, 'gi')
    const matches = text.match(pattern)
    if (matches) {
      education.push(...matches.slice(0, 2)) // Limit to 2 degrees
    }
  })

  return education.slice(0, 3) // Limit to 3 education entries
}