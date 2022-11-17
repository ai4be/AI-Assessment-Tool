export interface Project {
  _id?: string
  name: string
  columns?: Columns[]
  createdBy?: string
  dateCreated?: string
  backgroundImage?: string
  users?: string[]
}

interface Columns {
  id: string
  name: string
  sequence: number
  cards?: Cards[]
  createdBy: string
  date: Date
}

export interface Category {
  _id: string
  key: string
  name: string
}

interface Cards {
  id: string
  name: string
  description: string
  assignedTo?: User[]
  sequence: number
  createdBy: string
  date: Date
}

interface User {
  id: string
  name: string
  avatar: string
}
