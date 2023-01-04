import { defaultFetchOptions } from './api'

export const fetchColumns = async (projectId: string): Promise<any> => {
  const response = await fetch(`/api/projects/${projectId}/columns`).then(async (response) =>
    await response.json()
  )
  return response
}

export const deleteColumn = async (columnId: string, projectId: string): Promise<any> => {
  const url = `$/api/projects/${projectId}/columns/${columnId}`

  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'DELETE'
  })
  const inJSON = await response.json()
  return inJSON
}

export const addColumnToProject = async (columnId: string, projectId: string, columns: any[]): Promise<any> => {
  let sequence = 1

  if (columns.length > 0) {
    sequence = columns[columns.length - 1].sequence + 1
  }

  const data = {
    id: columnId,
    projectId,
    name: 'Add title',
    dateCreated: new Date().toLocaleString(),
    sequence
  }

  const url = `/api/projects/${data.projectId}/columns`

  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(data)
  })

  const inJSON = await response.json()

  return inJSON
}

export const updateColumn = async (obj: { sequence?: number, name?: string, columnId: string, projectId: string }): Promise<any> => {
  const data: any = {
    _id: obj.columnId
  }
  if (obj.sequence != null) data.sequence = obj.sequence
  if (obj.name != null) data.name = obj.name
  if (Object.keys(data).length === 1) return

  const url = `/api/projects/${obj.projectId}/columns/${obj.columnId}`

  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  const inJSON = await response.json()

  return inJSON
}
