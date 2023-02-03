import { Comment } from './comment'

export interface Card {
  _id: string
  originalId: string
  category: string
  title: string
  desc: string
  projectId: string
  columnId: string
  sequence: number
  section?: string
  TOCnumber: string
  questions: Question[]
  userIds?: string[] | any[]
  roleIds?: string[] | any[]
  dueDate?: Date | null
  stage?: CardStage
  example?: string[] | string
}

export type DisplayCard = Card & {
  questions: DisplayQuestion[]
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
  isScored: boolean | number
  TOCnumber?: string
  responses?: any[]
  conclusion?: string
}

export type DisplayQuestion = Question & {
  enabled?: boolean
  cleanTitle?: string
  comments?: Comment[]
  enabledCondition?: {
    disabledText: string
    [key: string]: any
  }
}

export enum CardStage {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

export const STAGE_VALUES: readonly string[] = Object.freeze(Object.values(CardStage))
