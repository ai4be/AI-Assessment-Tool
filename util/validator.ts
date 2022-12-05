
export function isEmailValid (email: any): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// https://stackoverflow.com/a/72686232/1358489
/**
 * positive lookahead (?=) and negative lookahead (?!)
 * ^ start of string
 * (?=.*[0-9]) a digit must occur at least once
 * (?=.*[a-z]) a lower case letter must occur at least once
 * (?=.*[A-Z]) an upper case letter must occur at least once
 * (?=.*\W) a special character must occur at least once
 * (?=.* )? spaces are allowed
 * .{8,} at least 8 characters
 * $ end-of-string
 *
 */
export function isPasswordValid (password: any): boolean {
  return /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=.* )?.{8,}$/.test(password)
}
