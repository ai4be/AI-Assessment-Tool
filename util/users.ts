
export const fetchUsers = async (userIds: string[]): Promise<any[]> => {
  const promises: Array<Promise<Response>> = userIds.map(uid => fetch(`/api/users/${uid}`))
  const responses = await Promise.all(promises)
  const jsonPromises = responses.map(r => r.json())
  const usersData = await Promise.all(jsonPromises)
  return usersData
}

export const inviteUser = async ({ email, projectId }): Promise<boolean> => {
  const URL = '/api/invite-user'
  const data = {
    email,
    projectId
  }

  const response = await fetch(URL, {
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

  const json = await response.json()

  if (json.message === 'Invited') {
    return true
  } else {
    return false
  }
}
