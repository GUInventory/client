import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { AdminOrEditor } from '../role/admin_or_editor'

export const CreateButton = () => {
  const router = useRouter()
  const { warehouse_id, storage_id, item_id, cost_id } = router.query
  return (
    <>
      <AdminOrEditor>
        {warehouse_id && storage_id && !item_id && (
          <NextLink href={`/warehouse/${warehouse_id}/storage/${storage_id}/item/new`}>
            <Button size="sm" variant="outline" colorScheme="blue" leftIcon={<AddIcon size="sm" />}>
              Add item
            </Button>
          </NextLink>
        )}

        {warehouse_id && !storage_id && !item_id && (
          <NextLink href={`/warehouse/${warehouse_id}/storage/new`}>
            <Button size="sm" variant="outline" colorScheme="blue" leftIcon={<AddIcon size="sm" />}>
              Add storage
            </Button>
          </NextLink>
        )}

        {warehouse_id && storage_id && item_id && !cost_id && (
          <NextLink
            href={`/warehouse/${warehouse_id}/storage/${storage_id}/item/${item_id}/cost/new`}
          >
            <Button size="sm" variant="outline" colorScheme="blue" leftIcon={<AddIcon size="sm" />}>
              Add cost
            </Button>
          </NextLink>
        )}
      </AdminOrEditor>
    </>
  )
}
