import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, resumeUrl } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the PDF file
    const response = await fetch(resumeUrl)
    const arrayBuffer = await response.arrayBuffer()
    
    // Simple text extraction (in a real app, you'd use a proper PDF parser)
    const text = new TextDecoder().decode(arrayBuffer)
    
    // Mock AI parsing - extract skills, experience, etc.
    const skills = extractSkills(text)
    const experience = extractExperience(text)
    const location = extractLocation(text)

    // Update the user's profile with parsed data
    const { error } = await supabaseClient
      .from('profiles')
      .update({
        skills: skills,
        experience_years: experience,
        location: location,
        resume_parsed: true
      })
      .eq('id', userId)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, skills, experience, location }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function extractSkills(text: string): string[] {
  // Mock skill extraction - in reality, you'd use NLP/AI
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis',
    'Vue.js', 'Angular', 'Django', 'Flask', 'Express', 'Next.js'
  ]
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 10)
}

function extractExperience(text: string): number {
  // Mock experience extraction
  const experienceMatch = text.match(/(\d+)\s*years?\s*(of\s*)?experience/i)
  return experienceMatch ? parseInt(experienceMatch[1]) : 3
}

function extractLocation(text: string): string {
  // Mock location extraction
  const locations = ['San Francisco', 'New York', 'Austin', 'Seattle', 'Remote']
  const found = locations.find(loc => text.includes(loc))
  return found || 'Remote'
}