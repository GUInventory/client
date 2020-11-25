import React from 'react'
import { Heading, Image, Text, Flex, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Layout, LoadingScreen, ErrorPage } from '@modules/core/components'
import { useItemQuery } from '@modules/warehouse/graphql/item/find.generated'

export const Item = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, loading, error } = useItemQuery({ variables: { id: +id } })

  if (loading || !id) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorPage />
  }

  return (
    <Layout>
      <Heading>{data.item.name}</Heading>
      <Text color="gray.400" fontSize="sm">
        Size: {`${data.item.size.x}x${data.item.size.y}x${data.item.size.z}`}
      </Text>
      <Flex flexDirection="row">
        <Box flex={1}>
          <Image src={data.item.image} />
        </Box>
      </Flex>
    </Layout>
  )
}
