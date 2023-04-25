export default function checkEnvironment (): string {
  const envUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://ai-assessment-tool-ai4belgium.vercel.app'

  return envUrl
}
