import { Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { Layout, Card } from '../../components'
import { useRegisterMutation } from '../../graphql/register/register.generated'
import { registerSchema } from './register.validation'
import { useAuthToken } from '../../hooks/use_auth_token'

type Inputs = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export const Register = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    resolver: yupResolver(registerSchema),
  })
  const [registerMutation] = useRegisterMutation()
  const { setAuthToken } = useAuthToken()
  const router = useRouter()

  const onSubmit = async (inputData) => {
    const {
      data: {
        register: { token },
      },
    } = await registerMutation({ variables: inputData })
    setAuthToken(token)
    router.push('/')
  }

  return (
    <Layout>
      <Card title="Register">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4} isInvalid={!!errors.name}>
            <FormLabel htmlFor="email">Name</FormLabel>
            <Input name="name" type="text" ref={register} placeholder="John Doe" />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">E-mail address</FormLabel>
            <Input name="email" type="email" ref={register} placeholder="john.doe@example.org" />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input name="password" type="password" ref={register} placeholder="*******" />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.passwordConfirmation}>
            <FormLabel htmlFor="password_again">Password again</FormLabel>
            <Input
              name="passwordConfirmation"
              type="password"
              ref={register}
              placeholder="*******"
            />
            <FormErrorMessage>{errors.passwordConfirmation?.message}</FormErrorMessage>
          </FormControl>

          <Button colorScheme="blue" type="submit">
            Register
          </Button>
        </form>
      </Card>
    </Layout>
  )
}
