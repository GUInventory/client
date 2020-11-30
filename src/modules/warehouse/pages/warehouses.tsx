import { Heading, IconButton, Flex, ButtonGroup } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useListMyWarehousesQuery, ListMyWarehousesDocument } from '../graphql/list.generated'
import { useDeleteWarehouseMutation } from '../graphql/delete.generated'
import { LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { AddIcon, ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { AdminOrEditor } from '@modules/core/components/role/admin_or_editor'
import { GlobalAdmin } from '@modules/core/components/role/global_admin'

export const Warehouses = () => {
  const { data, loading, error } = useListMyWarehousesQuery()
  const [deleteWarehouseMutation, deleteState] = useDeleteWarehouseMutation()

  if (error) {
    return <ErrorPage />
  }
  if (loading) {
    return <LoadingScreen />
  }

  const onDeleteClick = async (id) => {
    await deleteWarehouseMutation({
      variables: { id },
      refetchQueries: [{ query: ListMyWarehousesDocument }],
    })
  }

  return (
    <>
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
        <Flex justify="space-between" borderWidth="1px" rounded="lg" p={4} my={2}>
          {warehouse.name}
          <ButtonGroup size="sm" isAttached mt={1}>
            <NextLink href={`/warehouse/${warehouse.id}`}>
              <IconButton colorScheme="green" aria-label="Show" icon={<ViewIcon />} />
            </NextLink>
            <GlobalAdmin>
              <NextLink href={`/warehouse/${warehouse.id}/edit`}>
                <IconButton colorScheme="blue" aria-label="Edit" icon={<EditIcon />} />
              </NextLink>
              <IconButton
                colorScheme="red"
                aria-label="Delete"
                icon={<DeleteIcon />}
                onClick={() => onDeleteClick(+warehouse.id)}
              />
            </GlobalAdmin>
          </ButtonGroup>
        </Flex>
      ))}
    </>
  )
}
