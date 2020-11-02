import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/core'
import React from 'react'
import { Layout } from '../components'

export const Login = () => (
  <Layout>
    <Flex direction="column">
      <Heading fontSize="lg" textAlign="center">
        Login
      </Heading>

      <FormControl mb={4}>
        <FormLabel htmlFor="email">
          E-mail address
        </FormLabel>
        <Input name="email" type="email" placeholder="john.doe@example.org" />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel htmlFor="password">
            Password
        </FormLabel>
        <Input name="password" type="password" placeholder="*******" />
      </FormControl>

      <Button variantColor="blue" type="submit">
        Login
      </Button>
    </Flex>
  </Layout>
)
