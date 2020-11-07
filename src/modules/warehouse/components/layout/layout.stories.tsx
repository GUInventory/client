import React from 'react'
import { Layout } from './layout'
import { Box, Text } from '@chakra-ui/core'

export default {
  title: 'Auth/Layout',
}

export const layout = () => (
  <Layout>
    <Box w="100%" bg="red.300" textAlign="center">
      <Text py={5}>Layout content</Text>
    </Box>
  </Layout>
)
