import React from 'react'
import { AuthContext } from '@modules/core/providers/auth_provider'
import { useRouter } from 'next/router'

export const AdminOrEditor = ({ children }) => {
  const router = useRouter()
  const hasRole = (user) => {
    user.roles.map((role) => {
      if (
        role.warehouse.id == router.query.warehouse_id &&
        (role.type == 'ADMIN' || role.type == 'EDITOR')
      ) {
        return true
      }
    })
    return false
  }
  router.query.warehouse_id
  return <AuthContext.Consumer>{(user) => <>{hasRole(user) && children}</>}</AuthContext.Consumer>
}
