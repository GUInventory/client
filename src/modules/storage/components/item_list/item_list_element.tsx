import React from 'react'
import { Flex, Text, Image, ButtonGroup, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import { ViewIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'

export type ItemListElementProps = {
  id: string
  name: string
  image: string
  value: number
  warehouseId: string
  storageId: string
}
export const ItemListElement = ({ id, name, image, value, warehouseId, storageId }) => (
  <Flex flexDirection="row" align="center" rounded="lg" border="1px" borderColor="gray.200">
    <Image src={image} w="48px" h="48px" roundedLeft="lg" mr={4} />
    <Flex justify="space-between" w="100%">
      <Flex align="center">
        <Text fontWeight="bold">{name}</Text>
      </Flex>
      <Flex align="center">
        <Text alignSelf="right" mr={4}>
          {value} HUF
        </Text>
        <ButtonGroup size="sm" isAttached mt={1} mr={2}>
          <NextLink href={`/warehouse/${warehouseId}/storage/${storageId}/item/${id}`}>
            <IconButton colorScheme="green" aria-label="Show" icon={<ViewIcon />} />
          </NextLink>
          <NextLink href={`/warehouse/${warehouseId}/storage/${storageId}/item/${id}/edit`}>
            <IconButton colorScheme="blue" aria-label="Edit" icon={<EditIcon />} />
          </NextLink>
          <IconButton
            colorScheme="red"
            aria-label="Delete"
            icon={<DeleteIcon />}
            onClick={() => {}}
          />
        </ButtonGroup>
      </Flex>
    </Flex>
  </Flex>
)
