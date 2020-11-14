import React from 'react'
import { Heading, Text, Flex, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Layout, ItemList, ItemContainer } from '../../components'
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

  const items = data.storage.items.map((item) => {
    return {
      id: item.id,
      name: item.name,
      image: item.image,
      value: item.value,
    }
  })
  return (
    <Layout>
      <Breadcrumb
        data={[
          {
            href: `/warehouse/${data.storage.warehouse[0].id}`,
            title: data.storage.warehouse[0].name,
          },
          {
            href: '#',
            isCurrentPage: true,
            title: data.storage.name,
          },
        ]}
      />
      <Heading>{data.storage.name}</Heading>
      <Text color="gray.400" fontSize="sm">
        Size: {`${data.storage.size.x}x${data.storage.size.y}x${data.storage.size.z}`}
      </Text>
      <Flex flexDirection="row">
        <Box flex={1}>
          <Heading size="md" mb={2}>
            Storage
          </Heading>
          <ItemContainer items={items} />
        </Box>

        <Box flex={1}>
          <Heading size="md" mb={2}>
            List of Items
          </Heading>
          <ItemList items={items} />
        </Box>
      </Flex>
    </Layout>
  )
}
