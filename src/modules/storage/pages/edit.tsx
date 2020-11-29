import { Button, FormControl, FormLabel, Input, Heading, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useStorageQuery, StorageDocument } from '../graphql/find.generated'
import { useUpdateStorageMutation } from '../graphql/update.generated'
import { Breadcrumb } from '@modules/core/components'
import { updateSchema } from '../validators'
import { yupResolver } from '@hookform/resolvers/yup'

type Inputs = {
  name: string
  positionX: number
  positionY: number
  sizeX: number
  sizeY: number
  sizeZ: number
  warehouse: number
}

export const EditStorage = () => {
  const router = useRouter()
  const [updateStorageMutation, updateState] = useUpdateStorageMutation()
  const { data, loading, error } = useStorageQuery({ variables: { id: +router.query.storage_id } })

  const { register, handleSubmit, reset } = useForm<Inputs>({
    resolver: yupResolver(updateSchema),
  })

  useEffect(() => {
    reset({
      name: data?.storage?.name,
      sizeX: data?.storage?.size.x,
      sizeY: data?.storage?.size.y,
      sizeZ: data?.storage?.size.z,
      positionX: data?.storage?.position.x,
      positionY: data?.storage?.position.y,
    })
  }, [data])

  const onSubmit = async (inputData) => {
    const {
      data: {
        updateStorage: { id },
      },
    } = await updateStorageMutation({
      variables: {
        id: +router.query.storage_id,
        name: inputData.name,
        positionX: +inputData.positionX,
        positionY: +inputData.positionY,
        sizeX: +inputData.sizeX,
        sizeY: +inputData.sizeY,
        sizeZ: +inputData.sizeZ,
      },
      refetchQueries: [{ query: StorageDocument, variables: { id: +router.query.storage_id } }],
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
            href: `/warehouse/${data?.storage?.warehouse?.id}`,
            title: data?.storage?.warehouse?.name,
          },
          {
            href: `/warehouse/${data?.storage?.warehouse?.id}/storage/${data?.storage?.id}`,
            isCurrentPage: true,
            title: data?.storage?.name,
          },
          {
            href: '#',
            isCurrentPage: true,
            title: 'Edit',
          },
        ]}
      />
      <Heading>{data?.storage?.name}</Heading>
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

        <Button colorScheme="blue" type="submit" isLoading={updateState.loading}>
          Update
        </Button>
      </form>
    </>
  )
}
