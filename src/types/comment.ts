import { User } from '@/src/types/user'

export interface Comment {
  _id: string
  text: string
  projectId: string
  userId: string
  user: User
  questionId: string
  cardId: string
  userIds?: string[]
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
  deletedBy?: string
  parentId?: string
  parent?: Comment
}
