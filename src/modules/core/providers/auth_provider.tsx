import { useMeQuery, MeQueryResult } from '@modules/auth/graphql/me/me.generated'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type ContextProps = {
  id: string
  name: string
  globalRole: string
}
export const AuthContext = React.createContext<Partial<ContextProps>>({})

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const path = router.pathname.split('/')[1]
  const { data, error, loading } = useMeQuery()
  const [user, setUser] = useState({})

  useEffect(() => {
    if (error) {
      if (path !== 'auth') {
        router.push('/auth/login')
      }
    } else if (!loading) {
      if (path === 'auth') {
        router.push('/')
      }
      setUser(data.me)
    }
    return () => {}
  }, [loading])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
