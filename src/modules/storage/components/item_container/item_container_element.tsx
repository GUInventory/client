import React from 'react'
import { Box, Link, Popover, PopoverTrigger, PopoverContent, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

export type ItemContainerElementProps = {
  id: string
  name: String
  image: String
  value: number
}
export const ItemContainerElement = ({ id, name, image, value }) => (
  <NextLink href={`/warehouse/storage/item/${id}`}>
    <Link p={1}>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Box rounded="lg" backgroundColor="orange.400" _hover={{ backgroundColor: 'orange.300' }}>
            <Box w="48px" h="48px"></Box>
          </Box>
        </PopoverTrigger>

        <PopoverContent
          border="0"
          bg="gray.700"
          color="white"
          zIndex={4}
          width="300px"
          opacity={0.8}
        >
          <Box p={5}>
            <Text fontWeight="bold">{name}</Text>
            <Text>{value} HUF</Text>
          </Box>
        </PopoverContent>
      </Popover>
    </Link>
  </NextLink>
)
