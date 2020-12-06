import React, { useRef, useEffect, useState } from 'react'
import { Box, Text, Flex, useColorModeValue, Heading } from '@chakra-ui/react'
import Item from './item'
import WarehouseItem from './warehouse_item'
import { useDrop, DropTarget } from 'react-dnd'
import { useUpdateItemMutation } from '@modules/item/graphql/update.generated'
import { ItemDocument } from '@modules/item/graphql/find.generated'
import { StorageDocument } from '@modules/storage/graphql/find.generated'

type ItemsContainerProps = {
  setActiveItem: (int) => void
  activeItem: string
  storageId: string
  warehouseItems: {
    id: string
    name: string
    position: { x: number; y: number }
  }[]
  storageSize: { x: number; y: number }
  items: {
    id: string
    name: string
    image: string
    value: number
    size: { x: number; y: number; z: number }
    position: { x: number; y: number }
  }[]
}

const itemTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    const delta = monitor.getDifferenceFromInitialOffset()
    const left = Math.round(item.left + delta.x)
    const top = Math.round(item.top + delta.y)

    component.moveBox(item.id, left, top)
  },
}
export const ItemContainer = ({
  setActiveItem,
  activeItem,
  items,
  storageId,
  warehouseItems,
  storageSize,
}: ItemsContainerProps) => {
  const parentRef = useRef(null)
  const warehouseStorageRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [diff, setDiff] = useState(0)
  const [ratio, setRatio] = useState(0)
  const [warehouseItemsWidthPosition, setWarehouseItemsWidthPosition] = useState([])
  const [updateItemMutation, updateState] = useUpdateItemMutation()

  const calculateHeight = (x, y) => (100 / x) * y
  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        let parentWidth = parentRef.current.offsetWidth
        // Set the ratio
        setRatio(parentWidth / storageSize.x)
      }
      if (warehouseStorageRef.current) {
        // Set the width
        setWidth(warehouseStorageRef.current.offsetWidth)
        setDiff(
          parentRef.current.getBoundingClientRect().y -
            warehouseStorageRef.current.getBoundingClientRect().y,
        )
      }
    }
    // Add event listener to the window
    window.addEventListener('resize', handleResize)
    // Set the initial state
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const step = 32
    let x = 0
    let y = -step
    setWarehouseItemsWidthPosition(
      warehouseItems.map((item) => {
        y += step
        if (y + step >= width) {
          y = 0
          x += step
        }
        return {
          ...item,
          x,
          y,
        }
      }),
    )
  }, [width, warehouseItems])

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['Item', 'WarehouseItem'],
    drop: async (item: any, monitor) => {
      let { x, y } = monitor.getDifferenceFromInitialOffset()
      if (item.type == 'WarehouseItem') y = y - diff
      await updateItemMutation({
        variables: {
          id: +item.id,
          positionX: Math.round(item.x + y / ratio),
          positionY: Math.round(item.y + x / ratio),
          storage: { id: +storageId },
        },
        refetchQueries: [
          { query: StorageDocument, variables: { id: +storageId } },
          { query: ItemDocument, variables: { id: +item.id } },
        ],
      })
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  const [stateOfDrop, drop2] = useDrop({
    accept: 'Item',
    drop: async (item: any, monitor) => {
      await updateItemMutation({
        variables: {
          id: +item.id,
          positionX: -1,
          positionY: -1,
          moveToWarehouse: true,
        },
        refetchQueries: [
          { query: StorageDocument, variables: { id: +storageId } },
          { query: ItemDocument, variables: { id: +item.id } },
        ],
      })
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  const mapBg = useColorModeValue('gray.200', 'gray.800')
  const mapActiveBg = useColorModeValue('gray.100', 'gray.400')
  const mapBorder = useColorModeValue('gray.400', 'gray.600')
  return (
    <>
      <Heading size="md" mb={2}>
        Temporary storage
      </Heading>
      <Box w="100%" p={1}>
        <Box
          w="100%"
          h="200px"
          ref={warehouseStorageRef}
          borderWidth="2px"
          borderColor={mapBorder}
          bg={stateOfDrop.canDrop ? mapActiveBg : mapBg}
        >
          <div
            ref={drop2}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {(!warehouseItemsWidthPosition || stateOfDrop.canDrop) && (
              <Flex w="100%" h="100%" justify="center" align="center">
                <Text fontSize="2xl">Drop here to move to another storage</Text>
              </Flex>
            )}
            {warehouseItemsWidthPosition &&
              warehouseItemsWidthPosition.map((item) => <WarehouseItem item={item} />)}
          </div>
        </Box>
      </Box>

      <Heading size="md" mb={2}>
        Content of Storage
      </Heading>
      <Box maxW="100%" h="calc(100vh - 16px)" p={1}>
        <Box
          w="100%"
          pb={`${calculateHeight(storageSize.x, storageSize.y)}%`}
          bg={canDrop ? mapActiveBg : mapBg}
          borderWidth="2px"
          borderColor={mapBorder}
          position="relative"
        >
          <Box position="absolute" top="0" left="0" width="100%" height="100%">
            <div
              ref={drop}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              <Box w="100%" h="100%" ref={parentRef} position="relative">
                {items.map((item) => (
                  <Item
                    item={item}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    ratio={ratio}
                  />
                ))}
              </Box>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default DropTarget('Item', itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(ItemContainer)
