import { Box, Link, Spinner, Heading, PseudoBox, Tooltip, Flex } from '@chakra-ui/core'
import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useWarehouseQuery } from '@modules/warehouse/graphql/warehouse/find.generated'
import { Layout } from '../components'
import { StoragesContainer } from '../components/storages_container/storages_container'

export const Warehouse = () => {
  const router = useRouter()
  const { data, loading, error } = useWarehouseQuery({ variables: { id: +router.query.id } })

  if (error) {
    return <>Error</>
  }
  if (loading) {
    return <Spinner />
  }

  return (
    <Layout>
      <Heading mb={5}>{data.warehouse.name}</Heading>

      <Flex flexDirection={['column', 'column', 'row']} w="100%">
        <Box flex={1}>
          <Heading size="md" mb={2}>
            Map of Warehouse
          </Heading>
          <StoragesContainer storages={data.warehouse.storages} />
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
    </Layout>
  )
}
