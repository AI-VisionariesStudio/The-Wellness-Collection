/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

const securityHeaders = [
  // Disable DNS prefetching
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  // HSTS — 2 years, include subdomains, preload
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Clickjacking protection
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Disable legacy XSS auditor (modern browsers ignore it; keeping it on can introduce vulnerabilities)
  { key: 'X-XSS-Protection', value: '0' },
  // Referrer policy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not used by this app
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline for hydration scripts
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://connect.facebook.net",
      // Next.js uses inline styles
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self + data URIs + HTTPS (thumbnails may be hosted anywhere)
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
      // iframes: vdoCipher player, Google Docs, Office Online, Stripe
      "frame-src 'self' https://player.vdocipher.com https://docs.google.com https://view.officeapps.live.com https://js.stripe.com https://hooks.stripe.com https://*.supabase.co",
      // API connections: vdoCipher OTP, Sentry error reporting, Vercel analytics
      "connect-src 'self' https://dev.vdocipher.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://vitals.vercel-insights.com https://www.facebook.com https://connect.facebook.net",
      "worker-src 'self' blob:",
      // No plugins
      "object-src 'none'",
      // Restrict base tag hijacking
      "base-uri 'self'",
      // Only allow forms to submit to same origin
      "form-action 'self'",
      // Only allow this page to be framed by same origin
      "frame-ancestors 'self'",
      // Upgrade any remaining http requests to https
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', '@prisma/client'],
    instrumentationHook: true,
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') return []
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  hideSourceMaps: true,
})
