import { Box, Link, Heading, IconButton, Flex } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useListMyWarehousesQuery } from '@modules/warehouse/graphql/warehouse/list.generated'
import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { AddIcon } from '@chakra-ui/icons'

export const Warehouses = () => {
  const { data, loading, error } = useListMyWarehousesQuery()

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
            title: 'Warehouses',
          },
        ]}
      />
      <Flex justifyContent="space-between">
        <Heading>Warehouses</Heading>

        <NextLink href="/warehouse/new">
          <IconButton colorScheme="blue" aria-label="Add new warehouse" icon={<AddIcon />} />
        </NextLink>
      </Flex>
      {data.myWarehouses.map((warehouse) => (
        <Box borderWidth="1px" rounded="lg" p={4} my={2}>
          {warehouse.name}
          <NextLink href={`/warehouse/${warehouse.id}`}>
            <Link m={4}>Show</Link>
          </NextLink>
        </Box>
      ))}
    </Layout>
  )
}
