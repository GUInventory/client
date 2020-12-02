import React, { useRef, useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
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
    x: number
    y: number
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
  const [ratio, setRatio] = useState(0)
  const [updateItemMutation, updateState] = useUpdateItemMutation()

  const calculateHeight = (x, y) => (100 / x) * y
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
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['Item', 'WarehouseItem'],
    drop: async (item: any, monitor) => {
      const { x, y } = monitor.getDifferenceFromInitialOffset()
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

  return (
    <>
      <Box w="100%" h="200px" bg="gray.200">
        <div
          ref={drop2}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          {!warehouseItems && <Text fontSize="2xl">Drop here to move</Text>}
          {warehouseItems && warehouseItems.map((item) => <WarehouseItem item={item} />)}
        </div>
      </Box>
      <Box maxW="100%" h="calc(100vh - 16px)" p={1}>
        <Box
          w="100%"
          pb={`${calculateHeight(storageSize.x, storageSize.y)}%`}
          bg="gray.100"
          borderWidth="2px"
          borderColor="gray.400"
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
