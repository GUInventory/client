import { Box, Spinner } from '@chakra-ui/core'
import React from 'react'
import { useRouter } from 'next/router'
import { useWarehouseQuery } from '@modules/warehouse/graphql/warehouse/find.generated'
import { Layout } from '../components'

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
      <Box>{data.warehouse.name}</Box>
    </Layout>
  )
}
