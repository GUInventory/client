import React from 'react'
import { AuthContext } from '@modules/core/providers/auth_provider'
import { useRouter } from 'next/router'

export const AdminOrEditor = ({ children }) => {
  const router = useRouter()
  const hasRole = (user) => {
    let hasAccess = false
    user?.roles?.forEach((role) => {
      if (
        role.warehouse.id == router.query.warehouse_id &&
        (role.roleType == 'ADMIN' || role.roleType == 'EDITOR')
      ) {
        hasAccess = true
      }
    })
    return hasAccess
  }
  return <AuthContext.Consumer>{(user) => <>{hasRole(user) && children}</>}</AuthContext.Consumer>
}
