import { Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useAuth } from '@modules/core/providers/auth_provider'
import { Layout, Card } from '../../components'
import { useLoginMutation } from '../../graphql/login/login.generated'

type Inputs = {
  email: string
  password: string
}

export const Login = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const [loginMutation, { loading }] = useLoginMutation()
  const toast = useToast()
  const { login } = useAuth()
  const router = useRouter()

  const onSubmit = async (inputData) => {
    try {
      const {
        data: {
          login: { token },
        },
      } = await loginMutation({ variables: inputData })
      login(token)
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
      <Card title="Login">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4}>
            <FormLabel htmlFor="email">E-mail address</FormLabel>
            <Input name="email" type="email" ref={register} placeholder="john.doe@example.org" />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input name="password" type="password" ref={register} placeholder="*******" />
          </FormControl>

          <Button colorScheme="blue" type="submit" isLoading={loading}>
            Login
          </Button>
        </form>
      </Card>
    </Layout>
  )
}
