import React from 'react'
import { Box, Flex, Link } from '@chakra-ui/core'
import NextLink from 'next/link'

export const Layout = ({ children }) => (
  <>
    <Flex justifyContent="space-between" p={4}>
      <Box fontWeight="bold">GUINVENTORY</Box>
    </Flex>
    <Box maxW={1200} mt={8} mx="auto">
      {children}
    </Box>
  </>
)
