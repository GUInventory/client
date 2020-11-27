import React, { useState } from 'react'
import {
  Box,
  Flex,
  Link,
  Spinner,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Button,
  InputLeftElement,
  InputGroup,
  Input,
  Text,
  SimpleGrid,
} from '@chakra-ui/react'
import { ChevronDownIcon, AddIcon, SearchIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { useListMyWarehousesQuery } from '@modules/warehouse/graphql/list.generated'
import { useSearchQuery } from '@modules/core/graphql/search.generated'

export const Navigation = () => {
  const { data, loading, error } = useListMyWarehousesQuery()
  const [query, setQuery] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const searchQuery = useSearchQuery({ variables: { query }, skip: !searchEnabled })

  const search = (e) => {
    const value = e.target.value
    if (value.length > 2) {
      setQuery(value)
      setSearchEnabled(true)
    } else {
      setSearchEnabled(false)
    }
  }

  return (
    <>
      <Flex
        justifyContent="space-between"
        p={4}
        borderBottom="1px"
        borderColor="gray.200"
        h="100%"
        w="100%"
      >
        <Box fontWeight="bold">
          <NextLink href="/">
            <Link m={4}>GUINVENTORY</Link>
          </NextLink>
        </Box>
        <Box flex={1} mx={8}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
            <Input type="text" w="80%" placeholder="Search.." onChange={search} />
          </InputGroup>
        </Box>
        <Box>
          <NextLink href="/warehouse/storage/item/new">
            <Button size="sm" variant="outline" colorScheme="blue" leftIcon={<AddIcon size="sm" />}>
              Add item
            </Button>
          </NextLink>
          <NextLink href="/category">
            <Link m={4}>Categories</Link>
          </NextLink>
          <NextLink href="/log">
            <Link m={4}>Logs</Link>
          </NextLink>
          {loading && <Spinner />}
          {data && (
            <Menu>
              <MenuButton ml={3}>
                Warehouses <ChevronDownIcon />
              </MenuButton>
              <MenuList>
                {data.myWarehouses.map((warehouse) => (
                  <MenuItem>
                    <NextLink href={`/warehouse/${warehouse.id}`}>
                      <Link m={4}>{warehouse.name}</Link>
                    </NextLink>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </Box>
      </Flex>
      <Box w="100%">
        {searchEnabled ? (
          <Box
            zIndex="100"
            borderBottomColor="gray.200"
            borderBottomWidth="1px"
            position="absolute"
            bg="gray.50"
            w="100%"
            minH="100px"
            px={4}
            pt={4}
            pb={6}
            boxShadow="sm"
          >
            <Text fontSize="2xl">Search</Text>
            {searchQuery.loading && <Spinner />}
            {searchQuery.data && (
              <>
                <SimpleGrid
                  columns={3}
                  spacing={10}
                  w="100%"
                  py={2}
                  borderBottomColor="gray.200"
                  borderBottomWidth="1px"
                >
                  <Text fontWeight="bold">Item</Text>
                  <Text fontWeight="bold">Storage</Text>
                  <Text fontWeight="bold">Warehouse</Text>
                </SimpleGrid>
                {searchQuery.data.items.map((item) => (
                  <SimpleGrid
                    columns={3}
                    spacing={10}
                    w="100%"
                    py={2}
                    borderBottomColor="gray.200"
                    borderBottomWidth="1px"
                  >
                    <NextLink href={`/warehouse/storage/item/${item.id}`}>
                      <Link>{item.name}</Link>
                    </NextLink>
                    <NextLink href={`/warehouse/storage/${item.storage.id}`}>
                      <Link>{item.storage.name}</Link>
                    </NextLink>
                    <NextLink href={`/warehouse/${item.storage.warehouse.id}`}>
                      <Link>{item.storage.warehouse.name}</Link>
                    </NextLink>
                  </SimpleGrid>
                ))}
                {!searchQuery.data.items.length && (
                  <Text textAlign="center" fontSize="2xl">
                    No results...
                  </Text>
                )}
              </>
            )}
          </Box>
        ) : null}
      </Box>
    </>
  )
}
