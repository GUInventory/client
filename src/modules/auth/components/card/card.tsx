import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'

export const Card = ({ title, children }) => (
  <Flex direction="column" borderWidth="1px" rounded="lg" p={4}>
    <Heading fontSize="lg" textAlign="center" mb={3}>
      {title}
    </Heading>
    {children}
  </Flex>
)
