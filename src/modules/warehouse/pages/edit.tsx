import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Flex,
  FormErrorMessage,
  InputRightAddon,
  InputGroup,
  Box,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useWarehouseQuery, WarehouseDocument } from '../graphql/find.generated'
import { useUpdateWarehouseMutation } from '../graphql/update.generated'
import { Breadcrumb } from '@modules/core/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { warehouseSchema } from '../validators'
import { ListMyWarehousesDocument } from '../graphql/list.generated'

type Inputs = {
  name: string
  sizeX: number
  sizeY: number
  sizeZ: number
}

export const EditWarehouse = () => {
  const router = useRouter()
  const [updateWarehouseMutation, updateState] = useUpdateWarehouseMutation()
  const { data, loading, error } = useWarehouseQuery({
    variables: { id: +router.query.warehouse_id },
  })

  const { register, handleSubmit, reset, errors } = useForm<Inputs>({
    resolver: yupResolver(warehouseSchema),
  })

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
        id: +router.query.warehouse_id,
        sizeX: +inputData.sizeX,
        sizeY: +inputData.sizeY,
        sizeZ: +inputData.sizeZ,
        name: inputData.name,
      },
      refetchQueries: [
        { query: ListMyWarehousesDocument },
        { query: WarehouseDocument, variables: { id: +router.query.warehouse_id } },
      ],
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
            href: `/warehouse/${data?.warehouse?.id}`,
            title: data?.warehouse?.name,
          },
          {
            href: '#',
            isCurrentPage: true,
            title: 'Edit',
          },
        ]}
      />
      <Heading>{data?.warehouse?.name}</Heading>
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

        <Button colorScheme="blue" type="submit" isLoading={updateState.loading}>
          Update
        </Button>
      </form>
    </>
  )
}
