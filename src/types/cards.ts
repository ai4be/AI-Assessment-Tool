export interface Card {
  _id: string
  title: string
  desc: string
  columnId?: string
  assignedTo?: string
  projectId?: string
  sequence?: number
  label?: Label
}

export interface Label {
  bg: string
  type: string
}
