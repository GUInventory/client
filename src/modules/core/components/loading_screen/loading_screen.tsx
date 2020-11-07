import React from 'react'
import { Flex, Spinner } from '@chakra-ui/core'

export const LoadingScreen = () => (
  <Flex w="100%" h="100%" justify="center" align="center">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
      mt={5}
    />
  </Flex>
)
