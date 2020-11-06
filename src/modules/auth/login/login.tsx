import { Button, Flex, FormControl, FormLabel, Heading, Input, useToast } from '@chakra-ui/core'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { Layout } from '../components'
import { useLoginMutation } from '../graphql/login/login.generated'
import { useAuthToken } from '../hooks/use_auth_token'

type Inputs = {
  email: string
  password: string
}

export const Login = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const [login, { loading }] = useLoginMutation()
  const toast = useToast()
  const { setAuthToken } = useAuthToken()
  const router = useRouter()

  const onSubmit = async (inputData) => {
    try {
      const {
        data: {
          login: { token },
        },
      } = await login({ variables: inputData })
      setAuthToken(token)
      router.push('/')
    } catch (error) {
      toast({
        title: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Layout>
      <Flex direction="column">
        <Heading fontSize="lg" textAlign="center">
          Login
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4}>
            <FormLabel htmlFor="email">E-mail address</FormLabel>
            <Input name="email" type="email" ref={register} placeholder="john.doe@example.org" />
            {errors.email && <span>This field is required</span>}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input name="password" type="password" ref={register} placeholder="*******" />
            {errors.password && <span>This field is required</span>}
          </FormControl>

          <Button variantColor="blue" type="submit" isLoading={loading}>
            Login
          </Button>
        </form>
      </Flex>
    </Layout>
  )
}
