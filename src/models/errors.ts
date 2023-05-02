
export class WrongCredentialError extends Error {
  code = 9001
  constructor () {
    super('Wrong credential')
  }
}

export class InvalidPasswordError extends Error {
  code = 10004
  constructor () {
    super('Invalid password, password should be at least 8 characters long, contain a number and a special character')
  }
}
