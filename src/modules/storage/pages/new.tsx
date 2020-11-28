import { Button, FormControl, FormLabel, Input, Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useCreateStorageMutation } from '../graphql/create.generated'
import { Breadcrumb } from '@modules/core/components'

type Inputs = {
  name: string
  positionX: number
  positionY: number
  positionZ: number
  sizeX: number
  sizeY: number
  sizeZ: number
  warehouse: number
}

export const NewStorage = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const router = useRouter()
  const [createStorageMutation, { loading }] = useCreateStorageMutation()

  const onSubmit = async (inputData) => {
    const {
      data: {
        createStorage: { id },
      },
    } = await createStorageMutation({
      variables: {
        name: inputData.name,
        positionX: +inputData.positionX,
        positionY: +inputData.positionY,
        sizeX: +inputData.sizeX,
        sizeY: +inputData.sizeY,
        sizeZ: +inputData.sizeZ,
        warehouse: +router.query.warehouse_id,
      },
    })

    router.push(`/warehouse/${router.query.warehouse_id}/storage/${id}`)
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
            href: '#',
            isCurrentPage: true,
            title: 'New',
          },
        ]}
      />
      <Heading>Create Storage</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
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
        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  )
}
