import React, { useRef, useEffect, useState } from 'react'
import { Box, Flex, Link, Popover, PopoverTrigger, PopoverContent, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

type StoragesContainerProps = {
  setActiveStorage: (int) => void
  activeStorage: string
  warehouseSize: { x: number; y: number }
  warehouseId: string
  storages: {
    id: string
    name: string
    size: { x: number; y: number; z: number }
    position: { x: number; y: number }
  }[]
}

export const StoragesContainer = ({
  setActiveStorage,
  activeStorage,
  storages,
  warehouseSize,
  warehouseId,
}: StoragesContainerProps) => {
  const parentRef = useRef(null)
  const [ratio, setRatio] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        let parentWidth = parentRef.current.offsetWidth
        // Set the ratio
        setRatio(parentWidth / warehouseSize.x)
      }
    }

    // Add event listener to the window
    window.addEventListener('resize', handleResize)

    // Set the initial state
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Box w="100%" h="100%" ref={parentRef} position="relative">
      {storages.map((storage) => (
        <NextLink href={`/warehouse/${warehouseId}/storage/${storage.id}`}>
          <Link p={1}>
            <Popover trigger="hover">
              <PopoverTrigger>
                <Box
                  position="absolute"
                  w={`${ratio * storage.size.x}px`}
                  h={`${ratio * storage.size.y}px`}
                  top={`${ratio * storage.position.x}px`}
                  left={`${ratio * storage.position.y}px`}
                  borderWidth="1px"
                  borderColor="blue.200"
                  backgroundColor={activeStorage == storage.id ? 'blue.300' : 'blue.400'}
                  _hover={{ backgroundColor: 'blue.300' }}
                  onMouseEnter={() => setActiveStorage(storage.id)}
                  onMouseLeave={() => setActiveStorage('')}
                >
                  <Box></Box>
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
                  <Text fontWeight="bold">{storage.name}</Text>
                </Box>
              </PopoverContent>
            </Popover>
          </Link>
        </NextLink>
      ))}
    </Box>
  )
}
