import React from 'react'
import { Box, Link, Text, Flex, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import { DeleteIcon } from '@chakra-ui/icons'

export const CategoryElement = ({ id, name, color, numberOfItems, onDeleteClick }) => (
  <Flex
    borderWidth="1px"
    rounded="lg"
    p={4}
    my={2}
    alignContent="center"
    justifyContent="space-between"
  >
    <Flex>
      <Box backgroundColor={color} boxSize="16px" borderRadius="xl" m={3} />
      <Text mt={2}>{name}</Text>
    </Flex>
    <Flex>
      <Text m={2} color="gray.400">
        {numberOfItems} items
      </Text>

      <NextLink href={`/category/${id}`}>
        <Link m={2}>Show</Link>
      </NextLink>
      <IconButton
        colorScheme="red"
        aria-label="Delete"
        icon={<DeleteIcon />}
        onClick={onDeleteClick}
      />
    </Flex>
  </Flex>
)
