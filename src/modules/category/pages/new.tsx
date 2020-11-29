import { Button, FormControl, FormLabel, Input, Heading, FormErrorMessage } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Breadcrumb } from '@modules/core/components'
import { useCreateCategoryMutation } from '../graphql/create.generated'
import { useRouter } from 'next/router'
import { ListCategoriesDocument } from '../graphql/list.generated'
import { yupResolver } from '@hookform/resolvers/yup'
import { categorySchema } from '../validators'

type Inputs = {
  name: string
  color: string
}

export const NewCategory = () => {
  const { register, handleSubmit, reset, errors } = useForm<Inputs>({
    resolver: yupResolver(categorySchema),
  })
  const router = useRouter()
  const [createCategoryMutation, { loading }] = useCreateCategoryMutation()

  const onSubmit = async (inputData) => {
    await createCategoryMutation({
      variables: inputData,
      refetchQueries: [{ query: ListCategoriesDocument }],
    })

    router.push('/category')
  }

  return (
    <>
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
      <Heading>Create Category</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.color}>
          <FormLabel htmlFor="color">Color</FormLabel>
          <Input name="color" type="color" ref={register} />
          <FormErrorMessage>{errors.color?.message}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  )
}
