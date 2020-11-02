import React from 'react'
import { Box } from '@chakra-ui/core'

export const Layout = ({ children }) => (
  <Box maxW={460} mt={8} mx="auto">
    {children}
  </Box>
)
