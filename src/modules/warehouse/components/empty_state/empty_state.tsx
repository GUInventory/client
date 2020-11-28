import React from 'react'
import { EmptyState as BaseEmptyState } from '../../../../modules/core/components'
import { Button } from '@chakra-ui/react'
import NextLink from 'next/link'
import { AddIcon } from '@chakra-ui/icons'

export const EmptyState = ({ warehouseId }) => (
  <>
    <BaseEmptyState title="This Warehouse is empty 😔" />

    <NextLink href={`/warehouse/${warehouseId}/storage/new`}>
      <Button size="sm" variant="outline" colorScheme="blue" leftIcon={<AddIcon size="sm" />}>
        Create the first stroage
      </Button>
    </NextLink>
  </>
)
