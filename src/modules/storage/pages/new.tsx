import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Heading,
  FormErrorMessage,
  Box,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useCreateStorageMutation } from '../graphql/create.generated'
import { Breadcrumb } from '@modules/core/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { storageSchema } from '../validators'
import { WarehouseDocument } from '@modules/warehouse/graphql/find.generated'

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
  const { register, handleSubmit, errors } = useForm<Inputs>({
    resolver: yupResolver(storageSchema),
  })
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
      refetchQueries: [{ query: WarehouseDocument, variables: { id: +router.query.warehouse_id } }],
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

        <FormLabel htmlFor="image">Position</FormLabel>
        <Flex mb={4}>
          <FormControl isInvalid={!!errors.positionX}>
            <Input name="positionX" type="number" ref={register} />
            <FormErrorMessage>{errors.positionX?.message}</FormErrorMessage>
          </FormControl>
          <Box px={3}></Box>
          <FormControl isInvalid={!!errors.positionY}>
            <Input name="positionY" type="number" ref={register} />
            <FormErrorMessage>{errors.positionY?.message}</FormErrorMessage>
          </FormControl>
        </Flex>

        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  )
}
