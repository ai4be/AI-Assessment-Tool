import { Card } from './card'

export interface Project {
  _id: string
  name: string
  createdBy: string
  columns?: Columns[]
  createdAt?: number
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
  createdAt?: number
  updatedAt?: number
  userIds?: string[]
}
