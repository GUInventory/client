import React, { useContext, useState, useEffect } from 'react'

export interface AuthInterface {
  authState: {
    loggedIn: boolean
    token: string
    role: string
  }
  login: (token) => void
  logout: () => void
  setAuthToken: (token) => void
}

export const AuthContext = React.createContext<AuthInterface>(null)
const AuthProvider = ({ children }) => {
  const initialAuthState = {
    loggedIn: false,
    token: undefined,
    role: undefined,
    userId: undefined,
  }

  const [authState, setAuthState] = useState(initialAuthState)

  useEffect(() => {
    if (localStorage.getItem('TOKEN') !== authState.userId) {
      setAuthState({
        ...authState,
        token: localStorage.getItem('TOKEN'),
        loggedIn: true,
      })
    }
  }, [authState])

  const login = (token) => {
    setAuthState({
      ...authState,
      token,
      loggedIn: true,
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem('TOKEN', token)
    }
  }

  const setAuthToken = (token) => {
    setAuthState({
      ...authState,
      token,
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem('TOKEN', token)
    }
  }

  const logout = () => {
    setAuthState(initialAuthState)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('TOKEN')
    }
  }
  return (
    <AuthContext.Provider value={{ authState, login, logout, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider as default, useAuth }
