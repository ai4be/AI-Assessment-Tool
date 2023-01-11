export interface Card {
  _id: string
  originalId: string
  title: string
  desc: string
  projectId: string
  columnId: string
  sequence: number
  number: number
  questions: Question[]
  userIds?: string[] | any[]
  roleIds?: string[] | any[]
  dueDate?: number
  stage?: CardStage
}

export enum QuestionType {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXT = 'text'
}

export interface Question {
  id: string
  title: string
  answers: string[]
  isVisibleIf: string
  type: QuestionType
  isScored: boolean
  responses?: any[]
  conclusion?: string
}

export enum CardStage {
  PREPARATION = 'PREPARATION',
  EXECUTION = 'EXECUTION',
  UTILISATION = 'UTILISATION'
}

export const stageValues: string[] = Object.values(CardStage)
