import React from 'react'
import { Box, Flex, Link, Spinner, Menu, MenuList, MenuItem, MenuButton } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { useListMyWarehousesQuery } from '@modules/warehouse/graphql/warehouse/list.generated'

export const Layout = ({ children }) => {
  const { data, loading, error } = useListMyWarehousesQuery()
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
        <Box>
          <NextLink href="/category">
            <Link m={4}>Categories</Link>
          </NextLink>
          {loading && <Spinner />}
          {data && (
            <Menu>
              <MenuButton>
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
      <Box w="100%" h="100%" maxW={1200} mt={3} mx="auto" p={5}>
        {children}
      </Box>
    </>
  )
}
