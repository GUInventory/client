import { Box, Spinner, Heading } from '@chakra-ui/core'
import React from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../components'
import { useStorageQuery } from '../graphql/warehouse/find.generated'

export const Storage = () => {
  const router = useRouter()
  console.log(router.query)
  const { data, loading, error } = useStorageQuery({ variables: { id: +router.query.id } })

  if (error) {
    return <>Error</>
  }
  if (loading) {
    return <Spinner />
  }

  return (
    <Layout>
      <Heading>{data.storage.name}</Heading>
      {data.storage.items.map((item) => (
        <Box>{item.name}</Box>
      ))}
    </Layout>
  )
}
