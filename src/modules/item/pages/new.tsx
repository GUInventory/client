import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Layout } from '@modules/core/components'
import { useRouter } from 'next/router'
import { useCreateItemMutation } from '../graphql/create.generated'

type Inputs = {
  name: string
  color: string
}

export const NewItem = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const router = useRouter()
  const [createItemMutation, { loading }] = useCreateItemMutation()

  const onSubmit = async (inputData) => {
    const {
      data: {
        createItem: { id },
      },
    } = await createItemMutation({ variables: inputData })

    router.push(`/warehouse/storage/item/${id}`)
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="image">Image</FormLabel>
          <Input name="image" type="text" ref={register} />
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </Layout>
  )
}
