import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Resume parsing API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      parse: '/api/parse-resume',
      test: '/api/test-parsing'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided for testing' },
        { status: 400 }
      )
    }

    // Test the parsing functions with provided text
    const testResult = {
      textLength: text.length,
      preview: text.substring(0, 200) + '...',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: testResult
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}