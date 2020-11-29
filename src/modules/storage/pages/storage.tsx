import React, { useState } from 'react'
import { Heading, Text, Flex, Box, Button, ButtonGroup, IconButton, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ItemContainer } from '../components'
import { useStorageQuery, StorageDocument } from '../graphql/find.generated'
import { LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { AddIcon, ViewIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { useDeleteItemMutation } from '@modules/item/graphql/delete.generated'

export const Storage = () => {
  const router = useRouter()
  const { storage_id } = router.query
  const { data, loading, error } = useStorageQuery({ variables: { id: +storage_id } })
  const [activeItem, setActiveItem] = useState('')
  const [deleteItemMutation, deleteState] = useDeleteItemMutation()

  if (loading || !storage_id) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorPage />
  }

  const onDeleteClick = async (id) => {
    await deleteItemMutation({
      variables: { id },
      refetchQueries: [{ query: StorageDocument, variables: { id: +router.query.storage_id } }],
    })
  }

  const items = data.storage.items.map((item) => {
    return {
      id: item.id,
      name: item.name,
      image: item.image,
      value: item.value,
      size: {
        x: item.size.x,
        y: item.size.y,
        z: item.size.z,
      },
      position: {
        x: item.position.x,
        y: item.position.y,
      },
    }
  })

  const calculateHeight = (x, y) => (100 / x) * y

  return (
    <>
      <Breadcrumb
        data={[
          {
            href: '/',
            title: 'Warehouses',
          },
          {
            href: `/warehouse/${data.storage.warehouse.id}`,
            title: data.storage.warehouse.name,
          },
          {
            href: '#',
            isCurrentPage: true,
            title: data.storage.name,
          },
        ]}
      />
      <Flex justify="space-between">
        <Box>
          <Heading mb={5}>{data.storage.name}</Heading>
          <Text color="gray.400" fontSize="sm">
            Size: {`${data.storage.size.x}x${data.storage.size.y}x${data.storage.size.z}`}
          </Text>
        </Box>
        <ButtonGroup size="sm" variant="ghost" isAttached mt={1} mr={2}>
          <NextLink
            href={`/warehouse/${data.storage.warehouse.id}/storage/${data.storage.id}/edit`}
          >
            <IconButton colorScheme="blue" aria-label="Edit" icon={<EditIcon />} />
          </NextLink>
        </ButtonGroup>
      </Flex>
      <Flex flexDirection="row">
        <Box flex={1}>
          <Flex flexDirection={['column', 'column', 'row']} w="100%">
            <Box flex={1} pr={3} pb={3}>
              <Heading size="md" mb={2}>
                Content of Storage
              </Heading>
              <Box maxW="100%" h="calc(100vh - 16px)" p={1}>
                <Box
                  w="100%"
                  pb={`${calculateHeight(data.storage.size.x, data.storage.size.y)}%`}
                  bg="gray.100"
                  borderWidth="2px"
                  borderColor="gray.400"
                  position="relative"
                >
                  <Box position="absolute" top="0" left="0" width="100%" height="100%">
                    <ItemContainer
                      items={items}
                      storageId={data.storage.id}
                      warehouseId={data.storage.warehouse.id}
                      storageSize={{ x: data.storage.size.x, y: data.storage.size.y }}
                      setActiveItem={(id) => setActiveItem(id)}
                      activeItem={activeItem}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box flex={1}>
              <Flex justify="space-between">
                <Heading size="md" mb={2}>
                  List of Items
                </Heading>
                <NextLink
                  href={`/warehouse/${router.query.warehouse_id}/storage/${router.query.storage_id}/item/new`}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<AddIcon size="sm" />}
                  >
                    Add item
                  </Button>
                </NextLink>
              </Flex>
              {data.storage.items.map((item) => (
                <Flex
                  justify="space-between"
                  borderWidth="1px"
                  key={item.id}
                  p={4}
                  my={2}
                  bg={activeItem == item.id ? 'gray.50' : 'white'}
                  boxShadow={activeItem == item.id ? 'md' : ''}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem('')}
                  flexDirection="row"
                  align="center"
                  rounded="lg"
                  borderColor="gray.200"
                >
                  <Image src={item.image} w="48px" h="48px" roundedLeft="lg" mr={4} />
                  <Flex justify="space-between" w="100%">
                    <Flex align="center">
                      <Text fontWeight="bold">{item.name}</Text>
                    </Flex>
                    <Flex align="center">
                      <Text alignSelf="right" mr={4}>
                        {item.value} HUF
                      </Text>
                      <ButtonGroup size="sm" isAttached mt={1} mr={2}>
                        <NextLink
                          href={`/warehouse/${data.storage.warehouse.id}/storage/${data.storage.id}/item/${item.id}`}
                        >
                          <IconButton colorScheme="green" aria-label="Show" icon={<ViewIcon />} />
                        </NextLink>
                        <NextLink
                          href={`/warehouse/${data.storage.warehouse.id}/storage/${data.storage.id}/item/${item.id}/edit`}
                        >
                          <IconButton colorScheme="blue" aria-label="Edit" icon={<EditIcon />} />
                        </NextLink>
                        <IconButton
                          colorScheme="red"
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          onClick={() => {}}
                        />
                      </ButtonGroup>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}
