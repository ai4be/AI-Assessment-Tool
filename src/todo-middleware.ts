export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/projects/:path*',
    '/settings/:path*',
    '/templates/:path*',
    '/api/projects/:path*'
  ]
}
