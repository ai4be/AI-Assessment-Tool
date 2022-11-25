
export function isEmailValid (email: any): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
