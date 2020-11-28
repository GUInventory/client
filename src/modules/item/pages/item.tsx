import React from 'react'
import { Heading, Image, Text, Grid, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { LoadingScreen, ErrorPage } from '@modules/core/components'
import { useItemQuery } from '../graphql/find.generated'

export const Item = () => {
  const router = useRouter()
  const { item_id } = router.query
  const { data, loading, error } = useItemQuery({ variables: { id: +item_id } })

  if (loading || !item_id) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorPage />
  }

  return (
    <>
      <Heading>{data.item.name}</Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <Box>
          <Text color="gray.400" fontSize="sm">
            Size: {`${data.item.size.x}x${data.item.size.y}x${data.item.size.z}`}
          </Text>
          <Image src={data.item.image} />
        </Box>
        <Box flex={1}>
          <Text fontSize="xl">Logs</Text>
          {data.item.logs.map((log) => (
            <Text fontFamily="monospace">
              {log.createdAt}: {log.type} by {log.user.name}
            </Text>
          ))}
        </Box>
      </Grid>
    </>
  )
}
