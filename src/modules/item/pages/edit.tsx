import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Flex,
  FormErrorMessage,
  Box,
  InputRightAddon,
  InputGroup,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useItemQuery, ItemDocument } from '../graphql/find.generated'
import { useUpdateItemMutation } from '../graphql/update.generated'
import { Breadcrumb } from '@modules/core/components'
import { itemSchema } from '../validators'
import { yupResolver } from '@hookform/resolvers/yup'

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

  const { register, handleSubmit, reset, errors } = useForm<Inputs>({
    resolver: yupResolver(itemSchema),
  })

  useEffect(() => {
    reset({
      name: data?.item?.name,
      image: data?.item?.image,
      value: data?.item?.value,
      positionX: data?.item?.position?.x,
      positionY: data?.item?.position?.y,
      positionZ: data?.item?.position?.z,
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
        positionZ: +inputData.positionZ,
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
        <FormControl mb={4} isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.image}>
          <FormLabel htmlFor="name">Image</FormLabel>
          <Input name="image" type="text" ref={register} />
          <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.value}>
          <FormLabel htmlFor="value">Value</FormLabel>
          <Input name="value" type="text" ref={register} />
          <FormErrorMessage>{errors.value?.message}</FormErrorMessage>
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
          <Box px={3}></Box>
          <FormControl isInvalid={!!errors.positionZ}>
            <Input name="positionZ" type="number" ref={register} />
            <FormErrorMessage>{errors.positionZ?.message}</FormErrorMessage>
          </FormControl>
        </Flex>

        <Button colorScheme="blue" type="submit" isLoading={updateState.loading}>
          Update
        </Button>
      </form>
    </>
  )
}
