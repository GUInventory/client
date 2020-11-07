import { Box, Heading } from '@chakra-ui/core'
import React from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../../components'
import { useStorageQuery } from '../../graphql/storage/find.generated'
import { LoadingScreen, Breadcrumb } from '@modules/core/components'

export const Storage = () => {
  const router = useRouter()
  const { data, loading, error } = useStorageQuery({ variables: { id: +router.query.id } })

  if (error) {
    return <>Error</>
  }
  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Layout>
      <Breadcrumb
        data={[
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
      <Heading>{data.storage.name}</Heading>
      {data.storage.items.map((item) => (
        <Box>{item.name}</Box>
      ))}
    </Layout>
  )
}
