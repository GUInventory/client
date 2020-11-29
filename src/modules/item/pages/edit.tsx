import { Button, FormControl, FormLabel, Input, Heading, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useItemQuery, ItemDocument } from '../graphql/find.generated'
import { useUpdateItemMutation } from '../graphql/update.generated'
import { Breadcrumb } from '@modules/core/components'

type Inputs = {
  name: string
  image: string
  value: number
  positionX: number
  positionY: number
  positionZ: number
  sizeX: number
  sizeY: number
  sizeZ: number
  storage: number
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
      value: data?.item?.value,
      positionX: data?.item?.position?.x,
      positionY: data?.item?.position?.y,
      sizeX: data?.item?.size?.x,
      sizeY: data?.item?.size?.y,
      sizeZ: data?.item?.size?.z,
    })
  }, [data])

  const onSubmit = async (inputData) => {
    await updateItemMutation({
      variables: {
        id: +router.query.item_id,
        name: inputData.name,
        image: inputData.image,
        value: +inputData.value,
        positionX: +inputData.positionX,
        positionY: +inputData.positionY,
        positionZ: +inputData.positionY,
        sizeX: +inputData.sizeX,
        sizeY: +inputData.sizeY,
        sizeZ: +inputData.sizeZ,
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
            href: `/warehouse/${data?.item?.storage?.warehouse?.id}`,
            title: data?.item?.storage?.warehouse?.name,
          },
          {
            href: `/warehouse/${data?.item?.storage?.warehouse?.id}/storage/${data?.item?.storage?.id}`,
            title: data?.item?.storage?.name,
          },
          {
            href: `/warehouse/${data?.item?.storage?.warehouse?.id}/storage/${data?.item?.storage?.id}/item/${data?.item?.id}`,
            title: data?.item?.name,
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

        <FormControl mb={4}>
          <FormLabel htmlFor="value">Value</FormLabel>
          <Input name="value" type="text" ref={register} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="image">Size</FormLabel>
          <Flex align="center">
            <Input name="sizeX" type="number" ref={register} />x
            <Input name="sizeY" type="number" ref={register} />x
            <Input name="sizeZ" type="number" ref={register} />
          </Flex>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="image">Position</FormLabel>
          <Flex align="center">
            <Input name="positionX" type="number" ref={register} />
            <Input name="positionY" type="number" ref={register} />
          </Flex>
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={updateState.loading}>
          Update
        </Button>
      </form>
    </>
  )
}
