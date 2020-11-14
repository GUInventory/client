import React from 'react'
import { Box, Text } from '@chakra-ui/react'

type EmptyStateProps = { title: String }
export const EmptyState = ({ title }: EmptyStateProps) => (
  <Box w="100%">
    <Text fontSize="2xl" textAlign="center">
      {title}
    </Text>
  </Box>
)
