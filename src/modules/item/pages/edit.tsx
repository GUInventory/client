import { Button, FormControl, FormLabel, Input, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useItemQuery, ItemDocument } from '../graphql/find.generated'
import { useUpdateItemMutation } from '../graphql/update.generated'
import { Breadcrumb } from '@modules/core/components'

type Inputs = {
  name: string
  image: string
}

export const EditItem = () => {
  const router = useRouter()
  const [updateItemMutation, updateState] = useUpdateItemMutation()
  const { data, loading, error } = useItemQuery({ variables: { id: +router.query.item_id } })

  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    reset({
      name: data?.item?.name,
      image: data?.item?.image,
    })
  }, [data])

  const onSubmit = async (inputData) => {
    const {
      data: {
        updateItem: { id },
      },
    } = await updateItemMutation({
      variables: {
        id: +router.query.item_id,
        ...inputData,
      },
      refetchQueries: [{ query: ItemDocument, variables: { id: +router.query.item_id } }],
    })

    router.push(
      `/warehouse/${router.query.warehouse_id}/storage/${router.query.storage_id}/item/${id}`,
    )
  }

  return (
    <>
      <Breadcrumb
        data={[
          {
            href: '/',
            title: 'Warehouses',
          },
          {
            href: `/warehouse/${data.item.storage.warehouse.id}`,
            title: data.item.storage.warehouse.name,
          },
          {
            href: `/warehouse/${data.item.storage.warehouse.id}/storage/${data.item.storage.id}`,
            title: data.item.storage.name,
          },
          {
            href: `/warehouse/${data.item.storage.warehouse.id}/storage/${data.item.storage.id}/item/${data.item.id}`,
            title: data.item.name,
          },
          {
            href: '#',
            title: 'Edit',
            isCurrentPage: true,
          },
        ]}
      />
      <Heading>{data?.item?.name}</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="image">Image</FormLabel>
          <Input name="image" type="text" ref={register} />
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={updateState.loading}>
          Update
        </Button>
      </form>
    </>
  )
}
