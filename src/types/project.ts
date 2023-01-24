import { Card } from './card'

export interface Project {
  _id: string
  name: string
  createdBy: string
  columns?: Columns[]
  createdAt?: Date
  backgroundImage?: string
  userIds?: string[]
  roles?: Role[]
  industry?: string
  description?: string
}

interface Columns {
  id: string
  name: string
  sequence: number
  cards?: Card[]
  createdBy: string
  date: Date
}

export interface Category {
  _id: string
  key: string
  name: string
}

export interface Role {
  _id?: string
  name: string
  desc: string
  createdAt?: Date
  updatedAt?: Date
  userIds?: string[]
}
