import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Heading,
  FormErrorMessage,
  InputGroup,
  InputRightAddon,
  Box,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { noImage } from '../utils/image'
import { useCreateItemMutation } from '../graphql/create.generated'
import { Breadcrumb } from '@modules/core/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { itemSchema } from '../validators'
import { StorageDocument } from '@modules/storage/graphql/find.generated'
import { ItemDocument } from '../graphql/find.generated'

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

export const NewItem = () => {
  const [image, setImage] = useState('')

  const onChange = (e) => {
    let file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (readerEvt) => {
        let binaryString = readerEvt.target.result
        // @ts-ignore
        setImage(btoa(binaryString))
      }
      reader.readAsBinaryString(file)
    }
  }

  const { register, handleSubmit, errors } = useForm<Inputs>({
    resolver: yupResolver(itemSchema),
  })

  console.log(errors)
  const router = useRouter()
  const [createItemMutation, { loading }] = useCreateItemMutation()

  const onSubmit = async (inputData) => {
    const variables = {
      name: inputData.name,
      ...(image && { image: image }),
      ...(!image && { image: noImage }),
      value: +inputData.value,
      positionX: +inputData.positionX,
      positionY: +inputData.positionY,
      positionZ: +inputData.positionY,
      sizeX: +inputData.sizeX,
      sizeY: +inputData.sizeY,
      sizeZ: +inputData.sizeZ,
      storage: +router.query.storage_id,
    }

    const {
      data: {
        createItem: { id },
      },
    } = await createItemMutation({
      variables,
      refetchQueries: [
        { query: ItemDocument, variables: { id: +router.query.item_id } },
        { query: StorageDocument, variables: { id: +router.query.storage_id } },
      ],
    })

    router.push(
      `/warehouse/${router.query.warehouse_id}/storage/${router.query.storage_id}/item/${id}`,
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
            href: `/warehouse/${router.query.warehouse_id}`,
            title: 'Warehouse',
          },
          {
            href: `/warehouse/${router.query.warehouse_id}/storage/${router.query.storage_id}`,
            title: 'Storage',
          },
          {
            href: '#',
            title: 'New',
            isCurrentPage: true,
          },
        ]}
      />
      <Heading>Create Item</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" type="text" ref={register} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.image}>
          <FormLabel htmlFor="image">Image</FormLabel>
          <input name="image" type="file" accept=".jpg, .jpeg" onChange={onChange} />
          <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.value}>
          <FormLabel htmlFor="value">Value</FormLabel>
          <Input name="value" type="number" ref={register} />
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

        <Button colorScheme="blue" type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  )
}
