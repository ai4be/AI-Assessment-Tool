export interface Card {
  _id: string
  title: string
  desc: string
  columnId?: string
  userIds?: string[]
  roleIds?: string[]
  projectId?: string
  sequence?: number
  label?: Label
}

export interface Label {
  bg: string
  type: string
}
