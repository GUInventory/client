import React from 'react'
import { Box } from '@chakra-ui/react'
import { Navigation } from '../navigation/navigation'

export const Layout = ({ children }) => (
  <>
    <Navigation />
    <Box w="100%" h="100%" maxW={1200} mt={3} mx="auto" p={5}>
      {children}
    </Box>
  </>
)
