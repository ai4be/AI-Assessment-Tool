export interface User {
  _id?: string
  email: string
  password?: string
  firstName: string
  lastName: string
  emailVerified?: Boolean
  avatar?: string
  xsAvatar?: string
}
