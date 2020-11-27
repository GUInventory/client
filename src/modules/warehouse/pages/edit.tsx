import { Button, FormControl, FormLabel, Input, Heading, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useWarehouseQuery, WarehouseDocument } from '../graphql/find.generated'
import { useUpdateWarehouseMutation } from '../graphql/update.generated'

type Inputs = {
  name: string
  sizeX: number
  sizeY: number
  sizeZ: number
}

export const EditWarehouse = () => {
  const router = useRouter()
  const [updateWarehouseMutation, updateState] = useUpdateWarehouseMutation()
  const { data, loading, error } = useWarehouseQuery({ variables: { id: +router.query.id } })

  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    reset({
      name: data?.warehouse?.name,
      sizeX: data?.warehouse?.size.x,
      sizeY: data?.warehouse?.size.y,
      sizeZ: data?.warehouse?.size.z,
    })
  }, [data])

  const onSubmit = async (inputData) => {
    const {
      data: {
        updateWarehouse: { id },
      },
    } = await updateWarehouseMutation({
      variables: {
        id: +router.query.id,
        sizeX: +inputData.sizeX,
        sizeY: +inputData.sizeY,
        sizeZ: +inputData.sizeZ,
        name: inputData.name,
      },
      refetchQueries: [{ query: WarehouseDocument, variables: { id: +router.query.id } }],
    })

    router.push(`/warehouse/${id}`)
  }

  return (
    <>
      <Heading>{data?.warehouse?.name}</Heading>
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

        <Button colorScheme="blue" type="submit" isLoading={updateState.loading}>
          Update
        </Button>
      </form>
    </>
  )
}
