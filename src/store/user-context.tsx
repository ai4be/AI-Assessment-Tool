import { Context, createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser } from '@/util/users-fe'
import { User } from '@/util/user'
import { useSession } from 'next-auth/react'

interface UserContextType {
  user: User | null
  setUser: Function
  triggerReloadUser: Function
}

const UserContext: Context<UserContextType> = createContext({
  user: null,
  setUser: (u: User) => {},
  triggerReloadUser: () => {}
})

export function UserContextProvider (props: any): JSX.Element {
  const router = useRouter()
  const { data, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [reloadUser, setReloadUser] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (data?.user == null) {
      setUser(null)
      void router.push('/login')
      return
    }
    void getCurrentUser().then(user => {
      console.log('setting user', user)
      setUser(user)
    })
  }, [data, data?.user, status, reloadUser])

  const context = {
    user,
    setUser: setUser as Function,
    triggerReloadUser: () => setReloadUser(!reloadUser)
  }

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
