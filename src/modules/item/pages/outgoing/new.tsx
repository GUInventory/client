import { Button, FormControl, FormLabel, Input, Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { Breadcrumb } from '@modules/core/components'
import { useCreateOutgoingMutation } from '@modules/item/graphql/outgoing/create.generated'
import { ItemDocument } from '@modules/item/graphql/find.generated'

type Inputs = {
  description: string
  value: number
  item: number
}

export const NewOutgoing = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const router = useRouter()
  const [createOutgoingMutation, { loading }] = useCreateOutgoingMutation()

  const onSubmit = async (inputData) => {
    await createOutgoingMutation({
      variables: {
        description: inputData.description,
        value: +inputData.value,
        item: +router.query.item_id,
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
            title: 'New',
            isCurrentPage: true,
          },
        ]}
      />
      <Heading>Create cost</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input name="description" type="text" ref={register} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="value">Value</FormLabel>
          <Input name="value" type="text" ref={register} />
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  )
}
