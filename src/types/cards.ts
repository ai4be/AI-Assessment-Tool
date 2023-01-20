export interface Card {
  _id: string
  title: string
  desc: string
  userIds?: string[] | any[]
  roleIds?: string[] | any[]
  projectId?: string | any[]
  sequence?: number
  label?: Label
  questions?: any[]
}

export interface Label {
  bg: string
  type: string
}

export enum CardStage {
  PREPARATION = 'PREPARATION',
  EXECUTION = 'EXECUTION',
  UTILISATION = 'UTILISATION'
}

export const stageValues: string[] = Object.values(CardStage)
