import React from 'react'
import { Box, useColorMode, Button, Flex } from '@chakra-ui/react'
import { Navigation } from '../navigation/navigation'

export const Layout = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <>
      <Navigation />
      <Box w="100%" h="100%" maxW={1200} mt={3} mx="auto" p={5}>
        {children}
      </Box>
      <Flex justify="center" w="100%" p={5}>
        <Button size="xs" onClick={toggleColorMode}>
          Use {colorMode === 'light' ? 'Dark' : 'Light'} mode
        </Button>
      </Flex>
    </>
  )
}
