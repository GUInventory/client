import { Button, FormControl, FormLabel, Input, Heading, FormErrorMessage } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Breadcrumb } from '@modules/core/components'
import { useRouter } from 'next/router'
import { useUpdateCategoryMutation } from '../graphql/update.generated'
import { useCategoryQuery } from '../graphql/find.generated'
import { ListCategoriesDocument } from '../graphql/list.generated'
import { yupResolver } from '@hookform/resolvers/yup'
import { categorySchema } from '../validators'

type Inputs = {
  name: string
  color: string
}

export const EditCategory = () => {
  const router = useRouter()
  const [updateCategoryMutation, updateState] = useUpdateCategoryMutation()
  const { data, loading, error } = useCategoryQuery({ variables: { id: +router.query.id } })

  const { register, handleSubmit, reset, errors } = useForm<Inputs>({
    resolver: yupResolver(categorySchema),
  })
  useEffect(() => {
    reset({
      name: data?.category?.name,
      color: data?.category?.color,
    })
  }, [data])

  const onSubmit = async (inputData) => {
    await updateCategoryMutation({
      variables: {
        id: +router.query.id,
        ...inputData,
      },
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
            title: `Edit ${data?.category?.name}`,
          },
        ]}
      />

      <Heading>{data?.category?.name}</Heading>
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

        <Button colorScheme="blue" type="submit" isLoading={updateState.loading}>
          Update
        </Button>
      </form>
    </>
  )
}
