import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Layout, Breadcrumb } from '@modules/core/components'
import { useCreateCategoryMutation } from '../graphql/create.generated'
import { useRouter } from 'next/router'

type Inputs = {
  name: string
  color: string
}

export const NewCategory = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const router = useRouter()
  const [createCategoryMutation] = useCreateCategoryMutation()

  const onSubmit = async (inputData) => {
    const {
      data: {
        createCategory: { id },
      },
    } = await createCategoryMutation({ variables: inputData })

    router.push(`/category/${id}`)
  }

  return (
    <Layout>
      <Breadcrumb
        data={[
          {
            href: '/category',
            title: 'Categories',
          },
          {
            href: '#',
            isCurrentPage: true,
            title: 'New category',
          },
        ]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="color">Color</FormLabel>
          <Input name="color" type="color" ref={register} />
        </FormControl>

        <Button colorScheme="blue" type="submit">
          Create
        </Button>
      </form>
    </Layout>
  )
}
