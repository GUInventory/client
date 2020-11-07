import React from 'react'
import { Box, Flex, Link } from '@chakra-ui/core'
import NextLink from 'next/link'

export const Layout = ({ children }) => (
  <>
    <Flex justifyContent="space-between" p={4}>
      <Box fontWeight="bold">GUINVENTORY</Box>
      <Box>
        <NextLink href="/auth/login">
          <Link m={4}>Login</Link>
        </NextLink>
        <NextLink href="/auth/register">
          <Link m={4}>Register</Link>
        </NextLink>
      </Box>
    </Flex>
    <Box maxW={460} mt={8} mx="auto">
      {children}
    </Box>
  </>
)
