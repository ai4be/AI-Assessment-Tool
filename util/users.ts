import { defaultFetchOptions } from './api'
import { User } from '@/src/types/user'

export const getUserDisplayName = (user: User): string => {
  let res = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  if (res === '') res = user.email
  return res
}

export const getCurrentUser = async (): Promise<User | null> => {
  const response = await fetch('/api/users/me')
  if (response.ok) {
    const user = await response.json()
    return user
  }
  return null
}

export const fetchUsersByProjectId = async (projectId: string): Promise<{ activeUsers: User[], inactiveUsers: User[] }> => {
  const response = await fetch(`/api/projects/${projectId}/users`)
  if (response.ok) {
    const { activeUsers, inactiveUsers } = await response.json()
    return { activeUsers, inactiveUsers }
  }
  return { activeUsers: [], inactiveUsers: [] }
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
