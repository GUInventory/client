import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Flex,
  FormErrorMessage,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useCreateWarehouseMutation } from '../graphql/create.generated'
import { ListMyWarehousesDocument } from '../graphql/list.generated'
import { Breadcrumb } from '@modules/core/components'
import { warehouseSchema } from '../validators'
import { yupResolver } from '@hookform/resolvers/yup'

type Inputs = {
  name: string
  sizeX: number
  sizeY: number
  sizeZ: number
}

export const NewWarehouse = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    resolver: yupResolver(warehouseSchema),
  })
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
    <>
      <Breadcrumb
        data={[
          {
            href: '/',
            title: 'Warehouses',
          },
          {
            href: '#',
            isCurrentPage: true,
            title: 'New',
          },
        ]}
      />
      <Heading>Create warehouse</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormLabel htmlFor="image">Size</FormLabel>
        <Flex mb={4}>
          <FormControl isInvalid={!!errors.sizeX}>
            <InputGroup>
              <Input name="sizeX" type="number" ref={register} />
              <InputRightAddon children="cm" />
            </InputGroup>
            <FormErrorMessage>{errors.sizeX?.message}</FormErrorMessage>
          </FormControl>
          <Box px={3} pt={2}>
            X
          </Box>
          <FormControl isInvalid={!!errors.sizeY}>
            <InputGroup>
              <Input name="sizeY" type="number" ref={register} />
              <InputRightAddon children="cm" />
            </InputGroup>
            <FormErrorMessage>{errors.sizeY?.message}</FormErrorMessage>
          </FormControl>
          <Box px={3} pt={2}>
            X
          </Box>
          <FormControl isInvalid={!!errors.sizeZ}>
            <InputGroup>
              <Input name="sizeZ" type="number" ref={register} />
              <InputRightAddon children="cm" />
            </InputGroup>
            <FormErrorMessage>{errors.sizeZ?.message}</FormErrorMessage>
          </FormControl>
        </Flex>

        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  )
}
