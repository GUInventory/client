import { Button, FormControl, FormLabel, Input, Flex } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Layout } from '@modules/core/components'
import { useRouter } from 'next/router'
import { useCreateWarehouseMutation } from '@modules/warehouse/graphql/warehouse/create.generated'
import { ListMyWarehousesDocument } from '@modules/warehouse/graphql/warehouse/list.generated'

type Inputs = {
  name: string
  color: string
}

export const NewWarehouse = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const router = useRouter()
  const [createWarehouseMutation, { loading }] = useCreateWarehouseMutation()

  const onSubmit = async (inputData) => {
    const {
      data: {
        createWarehouse: { id },
      },
    } = await createWarehouseMutation({
      variables: {
        sizeX: +inputData.sizeX,
        sizeY: +inputData.sizeY,
        sizeZ: +inputData.sizeZ,
        name: inputData.name,
      },
      refetchQueries: [{ query: ListMyWarehousesDocument }],
    })

    router.push(`/warehouse/${id}`)
  }

  return (
    <Layout>
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

        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </Layout>
  )
}
