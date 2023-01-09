export interface Comment {
  _id: string
  text: string
  projectId: string
  userId: string
  questionId: string
  cardId: string
  userIds?: string[]
  createdAt: Date
  updatedAt?: Date
}
