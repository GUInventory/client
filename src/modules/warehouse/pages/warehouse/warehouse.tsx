import { Box, Text, Link, Heading, Flex, ButtonGroup, IconButton } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useWarehouseQuery } from '@modules/warehouse/graphql/warehouse/find.generated'
import { StoragesContainer, EmptyState } from '../../components'
import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

export const Warehouse = () => {
  const router = useRouter()
  const { data, loading, error } = useWarehouseQuery({ variables: { id: +router.query.id } })

  if (error) {
    return <ErrorPage />
  }
  if (loading) {
    return <LoadingScreen />
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
            <Heading size="md" mb={2}>
              List of Storages
            </Heading>
            {data.warehouse.storages.map((storage) => (
              <Box borderWidth="1px" rounded="lg" p={4} my={2}>
                {storage.name}
                <NextLink href={`/warehouse/storage/${storage.id}`}>
                  <Link m={4}>Show</Link>
                </NextLink>
              </Box>
            ))}
          </Box>
        </Flex>
      )}
    </Layout>
  )
}
