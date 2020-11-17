import React from 'react'
import { Login } from '@modules/auth'
import { useAuth } from '@modules/core/providers/auth_provider'

export default function LoginPage() {
  const { authState } = useAuth()
  console.log(authState)
  return <Login />
}
