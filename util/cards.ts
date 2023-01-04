import { defaultFetchOptions } from './api'

interface CardPatch {
  _id: string
  title?: string
  description?: string
  columnId?: string
  assignedTo?: string
  sequence?: number
}

export const addCard = async (columnId: string, projectId: string, userId: string, cards): Promise<any> => {
  const filteredCards = cards.filter((card) => card.columnId === columnId)
  let sequence = 1
  if (filteredCards.length > 0) {
    sequence = filteredCards[filteredCards.length - 1].sequence + 1
  }

  const data = {
    columnId,
    projectId,
    title: 'Add title',
    type: '',
    description: '',
    dateCreated: new Date().toLocaleString(),
    userId,
    assignedTo: '',
    sequence
  }

  const url = `/api/projects/${projectId}/columns/${columnId}/cards`

  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(data)
  })

  return await response.json()
}

export const updateCard = async (obj: CardPatch, projectId: string): Promise<any> => {
  const url = `/api/projects/${projectId}/cards/${obj._id}`

  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'PATCH',
    body: JSON.stringify(obj)
  })

  return await response.json()
}

export const updateCardSequence = async (obj: CardPatch, projectId: string): Promise<void> => {
  const { _id, title, description, columnId, sequence } = obj

  const data = {
    title,
    description,
    columnId,
    sequence
  }

  const url = `/api/projects/${projectId}/cards/${_id}`

  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  return await response.json()
}
