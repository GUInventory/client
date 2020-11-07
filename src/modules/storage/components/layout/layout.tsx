import React from 'react'
import { Box, Flex } from '@chakra-ui/core'

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
