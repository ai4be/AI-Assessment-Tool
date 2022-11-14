import shortId from 'shortid'
// import findIndex from 'lodash.findindex'

interface CardPatch {
  _id: string
  title?: string
  description?: string
  columnId?: string
  assignedTo?: string
  sequence?: number
}

export const addCard = async (columnId: string, boardId: string, userId: string, cards): Promise<any> => {
  const filteredCards = cards.filter((card) => card.columnId === columnId)
  let sequence = 1
  if (filteredCards.length > 0) {
    sequence = filteredCards[filteredCards.length - 1].sequence + 1
  }

  const cardId = shortId.generate()

  const data = {
    id: cardId,
    columnId,
    boardId,
    title: 'Add title',
    type: '',
    description: '',
    dateCreated: new Date().toLocaleString(),
    userId,
    assignedTo: '',
    sequence
  }

  const url = `/api/boards/${boardId}/columns/${columnId}/cards`

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  })

  const inJSON = await response.json()

  return inJSON
}

export const updateCard = async (obj: CardPatch, boardId: string): Promise<any> => {
  const url = `/api/boards/${boardId}/cards/${obj._id}`

  const response = await fetch(url, {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(obj)
  })

  const inJSON = await response.json()

  return inJSON
}

export const updateCardSequence = async (obj: CardPatch, boardId: string): Promise<void> => {
  const { _id, title, description, columnId, sequence } = obj

  const data = {
    title,
    description,
    columnId,
    sequence
  }

  const url = `/api/boards/${boardId}/cards/${_id}`

  const response = await fetch(url, {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  })

  const inJSON = await response.json()

  return inJSON
}
