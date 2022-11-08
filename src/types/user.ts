export interface UserDetail {
  id?: string
  email: string
  password: string
  confirmPassword?: string
  status: string | number
  isCreating: boolean
  isValid: boolean
  fullName: string
  isFetching: boolean
  message: string
  error: string
}

export interface SingleUser {
  id: string
  email: string
}
