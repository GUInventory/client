import React from 'react'
import { Button, Box, Link, Text, Stack } from '@chakra-ui/react'

export const ErrorPage = () => (
  <Box w="100%">
    <Text fontSize="4xl" textAlign="center" fontWeight="bold" my={4}>
      Something went wrong!
    </Text>

    <Text fontSize="xl" textAlign="center" my={4}>
      Please choose an option
    </Text>

    <Stack mt={8} spacing={4} direction="row" align="center" justify="center">
      <Button onClick={() => window.location.reload()}>Try again</Button>
      <Button variant="outline" as={Link} href="/">Go to Homepage</Button>
    </Stack>
  </Box>
)
