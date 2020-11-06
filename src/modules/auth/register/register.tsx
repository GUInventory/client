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
import { useForm } from 'react-hook-form'
import { useRegisterMutation } from '../graphql/register/register.generated'

type Inputs = {
  name: string,
  email: string,
  password: string,
}

export const Register = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const [registerMutation] = useRegisterMutation()

  const onSubmit = async (inputData) => {
    const { data: { register: { token } } } = await registerMutation({ variables: inputData })
    console.log(token)
  }

  return (
    <Layout>
      <Flex direction="column">
        <Heading fontSize="lg" textAlign="center">
          Register
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>

          <FormControl mb={4}>
            <FormLabel htmlFor="email">
              Name
            </FormLabel>
            <Input name="name" type="text" ref={register} placeholder="John Doe" />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel htmlFor="email">
              E-mail address
            </FormLabel>
            <Input name="email" type="email" ref={register} placeholder="john.doe@example.org" />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel htmlFor="password">
                Password
            </FormLabel>
            <Input name="password" type="password" ref={register} placeholder="*******" />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel htmlFor="password_again">
                Password again
            </FormLabel>
            <Input name="password_again" type="password" placeholder="*******" />
          </FormControl>

          <Button variantColor="blue" type="submit">
            Register
          </Button>
        </form>
      </Flex>
    </Layout>
  )
}
