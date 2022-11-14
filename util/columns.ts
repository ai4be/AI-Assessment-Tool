
export const fetchColumns = async (boardId: string): Promise<any> => {
  const response = await fetch(`/api/boards/${boardId}/columns`).then(async (response) =>
    await response.json()
  )
  return response
}

export const deleteColumn = async (columnId: string, boardId: string): Promise<any> => {
  const url = `$/api/boards/${boardId}/columns/${columnId}`

  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  })

  const inJSON = await response.json()

  return inJSON
}

export const addColumnToBoard = async (columnId: string, boardId: string, columns: any[]): Promise<any> => {
  let sequence = 1

  if (columns.length > 0) {
    sequence = columns[columns.length - 1].sequence + 1
  }

  const data = {
    id: columnId,
    boardId,
    columnName: 'Add title',
    dateCreated: new Date().toLocaleString(),
    sequence
  }

  const url = `/api/boards/${data.boardId}/columns`

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

export const updateColumn = async (obj: { sequence?: number, columnName?: string, columnId: string, boardId: string }): Promise<any> => {
  const data: any = {
    _id: obj.columnId
  }
  if (obj.sequence != null) data.sequence = obj.sequence
  if (obj.columnName != null) data.columnName = obj.columnName
  if (Object.keys(data).length === 1) return

  const url = `/api/boards/${obj.boardId}/columns/${obj.columnId}`

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
