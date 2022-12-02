export interface User {
  _id?: string
  email: string
  password?: string
  isValid: boolean
  firstName: string
  lastName: string
  emailVerified?: Boolean
  avatar?: string
  xsAvatar?: string
}

export interface SingleUser {
  id: string
  email: string
}
