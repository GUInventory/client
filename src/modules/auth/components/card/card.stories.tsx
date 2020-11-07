import React from 'react'
import { Card } from './card'
import { Box, Text } from '@chakra-ui/core'

export default {
  title: 'Auth/Card',
}

export const card = () => (
  <Card title="Card title">
    <Box w="100%" bg="red.300" textAlign="center">
      <Text py={5}>Card content</Text>
    </Box>
  </Card>
)
