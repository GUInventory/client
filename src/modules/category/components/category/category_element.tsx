import React from 'react'
import { Box, Text, Flex, IconButton, ButtonGroup } from '@chakra-ui/react'
import NextLink from 'next/link'
import { DeleteIcon, ViewIcon, EditIcon } from '@chakra-ui/icons'

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

      <ButtonGroup size="sm" isAttached mt={1}>
        <NextLink href={`/category/${id}`}>
          <IconButton
            colorScheme="green"
            aria-label="Show"
            icon={<ViewIcon />}
          /> 
        </NextLink>
        <NextLink href={`/category/${id}/edit`}>
          <IconButton
            colorScheme="blue"
            aria-label="Edit"
            icon={<EditIcon />}
          />
        </NextLink>
        <IconButton
          colorScheme="red"
          aria-label="Delete"
          icon={<DeleteIcon />}
          onClick={onDeleteClick}
        />
      </ButtonGroup>
    </Flex>
  </Flex>
)
