import React from 'react'
import { Flex } from '@chakra-ui/core'
import { ItemContainerElementProps, ItemContainerElement } from './item_container_element'

type ItemContainerProps = { items: ItemContainerElementProps[] }
export const ItemContainer = ({ items }: ItemContainerProps) => (
  <Flex mb={3}>
    {items.map((item) => (
      <ItemContainerElement {...item} />
    ))}
  </Flex>
)
