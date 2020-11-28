import { Button, FormControl, FormLabel, Input, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { Breadcrumb } from '@modules/core/components'
import { ItemDocument } from '@modules/item/graphql/find.generated'
import { useOutgoingQuery } from '@modules/item/graphql/outgoing/find.generated'
import { useUpdateOutgoingMutation } from '@modules/item/graphql/outgoing/update.generated'

type Inputs = {
  description: string
  value: number
}

export const EditOutgoing = () => {
  const router = useRouter()
  const [updateOutgoingMutation, updateState] = useUpdateOutgoingMutation()
  const { data, loading, error } = useOutgoingQuery({
    variables: { id: +router.query.cost_id },
  })

  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    reset({
      description: data?.outgoing?.description,
      value: data?.outgoing?.value,
    })
  }, [data])

  const onSubmit = async (inputData) => {
    await updateOutgoingMutation({
      variables: {
        description: inputData.description,
        value: +inputData.value,
        id: +router.query.cost_id,
      },
      refetchQueries: [{ query: ItemDocument, variables: { id: +router.query.item_id } }],
    })

    router.push(
      `/warehouse/${router.query.warehouse_id}/storage/${router.query.storage_id}/item/${router.query.item_id}`,
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
            href: `/warehouse/${router.query.warehouse_id}`,
            title: 'Warehouse',
          },
          {
            href: `/warehouse/${router.query.warehouse_id}/storage/${router.query.storage_id}`,
            title: 'Storage',
          },
          {
            href: `/warehouse/${router.query.warehouse_id}/storage/${router.query.storage_id}/item/${router.query.item_id}`,
            title: 'Item',
          },
          {
            href: '#',
            title: 'Edit',
            isCurrentPage: true,
          },
        ]}
      />
      <Heading>{data?.outgoing?.description}</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input name="description" type="text" ref={register} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="image">Value</FormLabel>
          <Input name="value" type="text" ref={register} />
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={updateState.loading}>
          Update
        </Button>
      </form>
    </>
  )
}
