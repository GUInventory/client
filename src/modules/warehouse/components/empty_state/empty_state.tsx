import React from 'react'
import { EmptyState as BaseEmptyState } from '../../../../modules/core/components'
import { Button, Flex } from '@chakra-ui/react'
import NextLink from 'next/link'
import { AddIcon } from '@chakra-ui/icons'

export const EmptyState = ({ warehouseId }) => (
  <>
    <BaseEmptyState title="This Warehouse is empty 😔" />

    <Flex justify="center" mt={4}>
      <NextLink href={`/warehouse/${warehouseId}/storage/new`}>
        <Button
          alignSelf="center"
          size="sm"
          variant="outline"
          colorScheme="blue"
          leftIcon={<AddIcon size="sm" />}
        >
          Create the first stroage
        </Button>
      </NextLink>
    </Flex>
  </>
)
