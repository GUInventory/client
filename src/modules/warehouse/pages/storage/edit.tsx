import { Button, FormControl, FormLabel, Input, Heading, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Layout, Breadcrumb } from '@modules/core/components'
import { useRouter } from 'next/router'
import { useStorageQuery, StorageDocument } from '@modules/warehouse/graphql/storage/find.generated'
import { useUpdateStorageMutation } from '@modules/warehouse/graphql/storage/update.generated'

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
  const { data, loading, error } = useStorageQuery({ variables: { id: +router.query.id } })

  const { register, handleSubmit, reset } = useForm<Inputs>()

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
        id: +router.query.id,
        name: inputData.name,
        positionX: +inputData.positionX,
        positionY: +inputData.positionY,
        sizeX: +inputData.sizeX,
        sizeY: +inputData.sizeY,
        sizeZ: +inputData.sizeZ,
      },
      refetchQueries: [{ query: StorageDocument, variables: { id: +router.query.id } }],
    })

    router.push(`/warehouse/storage/${id}`)
  }

  return (
    <Layout>
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
    </Layout>
  )
}
