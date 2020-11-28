import React from 'react'
import {
  Heading,
  Image,
  Text,
  Grid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { LoadingScreen, ErrorPage, Breadcrumb } from '@modules/core/components'
import { useItemQuery, ItemDocument } from '../graphql/find.generated'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useDeleteOutgoingMutation } from '../graphql/outgoing/delete.generated'

export const Item = () => {
  const router = useRouter()
  const { item_id } = router.query
  const { data, loading, error } = useItemQuery({ variables: { id: +item_id } })
  const [deleteOutgoingMutation, deleteState] = useDeleteOutgoingMutation()

  if (loading || !item_id) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorPage />
  }

  const onDeleteClick = async (id) => {
    await deleteOutgoingMutation({
      variables: { id },
      refetchQueries: [{ query: ItemDocument, variables: { id: +router.query.item_id } }],
    })
  }

  return (
    <>
      <Breadcrumb
        data={[
          {
            href: '/',
            title: 'Warehouses',
          },
          {
            href: `/warehouse/${data.item.storage.warehouse.id}`,
            title: data.item.storage.warehouse.name,
          },
          {
            href: `/warehouse/${data.item.storage.warehouse.id}/storage/${data.item.storage.id}`,
            title: data.item.storage.name,
          },
          {
            href: '#',
            title: data.item.name,
            isCurrentPage: true,
          },
        ]}
      />
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <Heading>{data.item.name}</Heading>
        <Stat textAlign="right">
          <StatLabel>Value</StatLabel>
          <StatNumber>{data.item.value} HUF</StatNumber>
        </Stat>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <Box>
          <Text color="gray.400" fontSize="sm">
            Size: {`${data.item.size.x}x${data.item.size.y}x${data.item.size.z}`}
          </Text>
          <Image src={data.item.image} />
        </Box>
        <Box flex={1}>
          <Text fontSize="xl">Costs</Text>
          {data.item.outgoings.map((outgoing) => (
            <Stat borderWidth="1px" borderColor="gray.200" borderRadius="lg" px={4} py={2} mb={1}>
              <Flex justify="space-between">
                <Box>
                  <StatLabel> {outgoing.description}</StatLabel>
                  <StatNumber>{outgoing.value} HUF</StatNumber>
                  <StatHelpText> {outgoing.createdAt}</StatHelpText>
                </Box>

                <ButtonGroup size="sm" variant="ghost" isAttached mt={1}>
                  <NextLink
                    href={`/warehouse/${data.item.storage.warehouse.id}/storage/${data.item.storage.id}/item/${data.item.id}/cost/${outgoing.id}/edit`}
                  >
                    <IconButton colorScheme="blue" aria-label="Edit" icon={<EditIcon />} />
                  </NextLink>
                  <IconButton
                    colorScheme="red"
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => {
                      onDeleteClick(+outgoing.id)
                    }}
                  />
                </ButtonGroup>
              </Flex>
            </Stat>
          ))}
          <Text fontSize="xl" mt={4}>
            Logs
          </Text>
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
