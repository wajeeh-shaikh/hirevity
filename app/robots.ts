import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentmatch.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/candidate/dashboard',
        '/recruiter/dashboard',
        '/api/',
        '/auth/reset-password',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}