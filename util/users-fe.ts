import { defaultFetchOptions } from './api'
import { User } from './user'

export const getUserDisplayName = (user: User): string => {
  let res = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  if (res === '') res = user.email
  return res
}

export const fetchUsers = async (userIds: string[]): Promise<any[]> => {
  const promises: Array<Promise<Response>> = userIds.map(async (uid: string) => await fetch(`/api/users/${uid}`))
  const responses: Response[] = await Promise.all(promises)
  const texts: any[] = await Promise.all(responses.map(async (res: Response) => await res.text()))
  const jsons = texts.filter(t => t?.length > 0).map(t => JSON.parse(t))
  return jsons
}

export const getCurrentUser = async (): Promise<User | null> => {
  const response = await fetch('/api/users/me')
  if (response.ok) {
    const user = await response.json()
    return user
  }
  return null
}

export const fetchUsersByProjectId = async (projectId: string): Promise<any[]> => {
  const response = await fetch(`/api/projects/${projectId}/users`)
  if (response.ok) {
    const users = await response.json()
    return users
  }
  return []
}

export const inviteUser = async ({ email, projectId }): Promise<boolean> => {
  const URL = '/api/invite-user'
  const data = {
    email,
    projectId
  }

  const response = await fetch(URL, {
    ...defaultFetchOptions,
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  const json = await response.json()

  if (json.message === 'Invited') {
    return true
  } else {
    return false
  }
}
