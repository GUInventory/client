import { Box, Link, Heading } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useListWarehousesQuery } from '@modules/warehouse/graphql/warehouse/list.generated'
import { Layout } from '../../components'
import { LoadingScreen, Breadcrumb } from '@modules/core/components'

export const Warehouses = () => {
  const { data, loading, error } = useListWarehousesQuery()

  if (error) {
    return <>Error</>
  }
  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Layout>
      <Breadcrumb data={[]} />
      <Heading>Warehouses</Heading>
      {data.warehouses.map((warehouse) => (
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
