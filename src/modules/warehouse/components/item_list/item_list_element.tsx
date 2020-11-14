import React from 'react'
import { Flex, Text, Image } from '@chakra-ui/react'

export type ItemListElementProps = {
  name: String
  image: String
  value: number
}
export const ItemListElement = ({ name, image, value }) => (
  <Flex flexDirection="row" align="center" rounded="lg" border="1px" borderColor="gray.200">
    <Image src={image} w="48px" h="48px" roundedLeft="lg" mr={4} />
    <Flex justify="space-between" w="100%">
      <Text fontWeight="bold">{name}</Text>
      <Text alignSelf="right" mr={4}>
        {value} HUF
      </Text>
    </Flex>
  </Flex>
)
