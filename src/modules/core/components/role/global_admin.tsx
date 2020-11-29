import React from 'react'
import { AuthContext } from '@modules/core/providers/auth_provider'

export const GlobalAdmin = ({ children }) => {
  return (
    <AuthContext.Consumer>
      {(user) => <>{user.globalRole == 'ADMIN' && children}</>}
    </AuthContext.Consumer>
  )
}
