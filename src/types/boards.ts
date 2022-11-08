export interface Board {
  _id?: string
  name: string
  columns?: Columns[]
  createdBy?: string
  dateCreated?: string
  backgroundImage?: string
  users?: string[]
}

export interface BoardSlice {
  board: Board
  status: string
  isLoading: boolean
  error: string
}

interface Columns {
  id: string
  name: string
  sequence: number
  cards?: Cards[]
  createdBy: string
  date: Date
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
