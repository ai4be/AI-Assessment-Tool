export interface CardDetail {
  _id: string
  title: string
  description: string
  columnId?: string
  assignedTo?: string
  boardId?: string
  sequence?: number
  label?: Label
}

export interface Label {
  bg: string
  type: string
}

export interface CardSlice {
  cards: CardDetail[]
}
