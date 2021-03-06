import React, { useState, useRef } from 'react'
import {
  Box,
  Flex,
  Link,
  Spinner,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  InputLeftElement,
  InputGroup,
  Input,
  Text,
  SimpleGrid,
  CloseButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { useListMyWarehousesQuery } from '@modules/warehouse/graphql/list.generated'
import { useSearchQuery } from '@modules/core/graphql/search.generated'
import { AuthContext } from '@modules/core/providers/auth_provider'
import { CreateButton } from './create_button'
import { GlobalAdmin } from '../role/global_admin'

export const Navigation = () => {
  const { data, loading, error } = useListMyWarehousesQuery()
  const [query, setQuery] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const searchQuery = useSearchQuery({ variables: { query }, skip: !searchEnabled })
  const searchFieldRef = useRef(null)

  const search = (e) => {
    const value = e.target.value
    if (value.length > 2) {
      setQuery(value)
      setSearchEnabled(true)
    } else {
      setSearchEnabled(false)
    }
  }
  const onSearchClose = () => {
    setQuery('')
    setSearchEnabled(false)
    searchFieldRef.current.value = ''
  }

  const bg = useColorModeValue('white', 'gray.800')
  const color = useColorModeValue('gray.800', 'white')

  return (
    <>
      <Flex
        justifyContent="space-between"
        p={4}
        align="center"
        borderBottom="1px"
        borderColor="gray.200"
        h="100%"
        w="100%"
      >
        <Box fontWeight="bold">
          <NextLink href="/">
            <Link m={4} fontSize="lg">
              GUINVENTORY
            </Link>
          </NextLink>
        </Box>
        <Box flex={1} mx={8}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
            <Input
              type="text"
              w="200px"
              bg={bg}
              placeholder="Search items..."
              color={color}
              _focus={{
                w: '80%',
              }}
              onChange={search}
              ref={searchFieldRef}
            />
          </InputGroup>
        </Box>
        <Box>
          <AuthContext.Consumer>
            {(user) => (
              <>
                <CreateButton />
                {/* <NextLink href="/category">
                  <Link m={4}>Categories</Link>
                </NextLink>*/}
                <GlobalAdmin>
                  <NextLink href="/log">
                    <Link m={4}>Logs</Link>
                  </NextLink>
                </GlobalAdmin>
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

                <Link
                  m={4}
                  onClick={() => {
                    localStorage.removeItem('TOKEN')
                    window.location.href = '/auth/login'
                  }}
                >
                  Logout
                </Link>
              </>
            )}
          </AuthContext.Consumer>
        </Box>
      </Flex>
      {searchEnabled ? (
        <Box
          w="100%"
          px={4}
          pt={4}
          pb={6}
          zIndex="100"
          borderBottomColor="gray.200"
          borderBottomWidth="1px"
          position="absolute"
          boxShadow="sm"
          bg={bg}
          color={color}
        >
          <Box w="100%" maxW={1200} minH="100px" m="0 auto">
            <Flex justify="space-between">
              <Text fontSize="2xl">Search</Text>
              <CloseButton onClick={onSearchClose} />
            </Flex>
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
                    <NextLink
                      href={`/warehouse/${item.storage.warehouse.id}/storage/${item.storage.id}/item/${item.id}`}
                    >
                      <Link>{item.name}</Link>
                    </NextLink>
                    <NextLink
                      href={`/warehouse/${item.storage.warehouse.id}/storage/${item.storage.id}`}
                    >
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
        </Box>
      ) : null}
    </>
  )
}
