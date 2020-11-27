import { Box, Text, Link, Heading, Flex, ButtonGroup, IconButton, Button } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useWarehouseQuery, WarehouseDocument } from '../graphql/find.generated'
import { StoragesContainer, EmptyState } from '../components'
import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { EditIcon, DeleteIcon, ViewIcon, AddIcon } from '@chakra-ui/icons'
import { useDeleteStorageMutation } from '@modules/storage/graphql/delete.generated'

export const Warehouse = () => {
  const router = useRouter()
  const { data, loading, error } = useWarehouseQuery({ variables: { id: +router.query.id } })
  const [deleteStorageMutation, deleteState] = useDeleteStorageMutation()

  if (error) {
    return <ErrorPage />
  }
  if (loading) {
    return <LoadingScreen />
  }

  const onDeleteClick = async (id) => {
    await deleteStorageMutation({
      variables: { id },
      refetchQueries: [{ query: WarehouseDocument, variables: { id: +router.query.id } }],
    })
  }

  return (
    <Layout>
      <Breadcrumb
        data={[
          {
            href: '#',
            isCurrentPage: true,
            title: data.warehouse.name,
          },
        ]}
      />
      <Flex justify="space-between">
        <Box>
          <Heading mb={5}>{data.warehouse.name}</Heading>
          <Text>{`${data.warehouse.size.x}x${data.warehouse.size.y}x${data.warehouse.size.z}`}</Text>
        </Box>
        <ButtonGroup size="sm" isAttached mt={1} mr={2}>
          <NextLink href={`/warehouse/${data.warehouse.id}/edit`}>
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
      {data.warehouse.storages.length === 0 && <EmptyState />}

      {data.warehouse.storages.length !== 0 && (
        <Flex flexDirection={['column', 'column', 'row']} w="100%">
          <Box flex={1}>
            <Heading size="md" mb={2}>
              Map of Warehouse
            </Heading>
            <StoragesContainer
              storages={data.warehouse.storages.map((storage) => {
                return {
                  id: storage.id,
                  name: storage.name,
                }
              })}
            />
          </Box>
          <Box flex={1}>
            <Flex justify="space-between">
              <Heading size="md" mb={2}>
                List of Storages
              </Heading>
              <NextLink href="/warehouse/storage/new">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<AddIcon size="sm" />}
                >
                  Add stroage
                </Button>
              </NextLink>
            </Flex>
            {data.warehouse.storages.map((storage) => (
              <Flex justify="space-between" borderWidth="1px" rounded="lg" p={4} my={2}>
                {storage.name}
                <ButtonGroup size="sm" isAttached mt={1}>
                  <NextLink href={`/warehouse/storage/${storage.id}`}>
                    <IconButton colorScheme="green" aria-label="Show" icon={<ViewIcon />} />
                  </NextLink>
                  <NextLink href={`/warehouse/storage/${storage.id}/edit`}>
                    <IconButton colorScheme="blue" aria-label="Edit" icon={<EditIcon />} />
                  </NextLink>
                  <IconButton
                    colorScheme="red"
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => onDeleteClick(+storage.id)}
                  />
                </ButtonGroup>
              </Flex>
            ))}
          </Box>
        </Flex>
      )}
    </Layout>
  )
}
