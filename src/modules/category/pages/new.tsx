import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Breadcrumb } from '@modules/core/components'
import { useCreateCategoryMutation } from '../graphql/create.generated'
import { useRouter } from 'next/router'
import { ListCategoriesDocument } from '../graphql/list.generated'

type Inputs = {
  name: string
  color: string
}

export const NewCategory = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="color">Color</FormLabel>
          <Input name="color" type="color" ref={register} />
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  )
}
