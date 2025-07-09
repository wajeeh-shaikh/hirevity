/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'rhegkieneabsjyxocial.supabase.co'],
  },
  typescript: {
    // Ignore TypeScript errors during build (for development)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ignore ESLint errors during build (for development)
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig