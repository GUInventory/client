import React, { useRef, useEffect, useState } from 'react'
import { Box, Flex, Link, Popover, PopoverTrigger, PopoverContent, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { ItemContainerElement } from './item_container_element'

type ItemsContainerProps = {
  setActiveItem: (int) => void
  activeItem: string
  storageSize: { x: number; y: number }
  storageId: string
  items: {
    id: string
    name: string
    image: string
    value: number
    size: { x: number; y: number; z: number }
    position: { x: number; y: number }
  }[]
}

export const ItemContainer = ({
  setActiveItem,
  activeItem,
  items,
  storageSize,
  storageId,
}: ItemsContainerProps) => {
  const parentRef = useRef(null)
  const [ratio, setRatio] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        let parentWidth = parentRef.current.offsetWidth
        // Set the ratio
        setRatio(parentWidth / storageSize.x)
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
      {items.map((item) => (
        <NextLink href={`/storage/${storageId}/item/${item.id}`}>
          <Link p={1}>
            <Popover trigger="hover">
              <PopoverTrigger>
                <Box
                  position="absolute"
                  w={`${ratio * item.size.x}px`}
                  h={`${ratio * item.size.y}px`}
                  top={`${ratio * item.position.x}px`}
                  left={`${ratio * item.position.y}px`}
                  borderWidth="1px"
                  borderColor="blue.200"
                  backgroundColor={activeItem == item.id ? 'blue.300' : 'blue.400'}
                  _hover={{ backgroundColor: 'blue.300' }}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem('')}
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
                  <Text fontWeight="bold">{item.name}</Text>
                </Box>
              </PopoverContent>
            </Popover>
          </Link>
        </NextLink>
      ))}
    </Box>
  )
}
