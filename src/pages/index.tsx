import React from 'react'
import { Heading, Link, Box } from '@chakra-ui/core'

export default function Home() {
  return (
    <Box textAlign="center" mx="auto">
      <Heading>Home Page</Heading>
      <Link href="/auth/login" m={4}>Login</Link>
      <Link href="/auth/register" m={4}>Register</Link>
    </Box>
  )
}
