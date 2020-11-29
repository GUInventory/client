import React, { useRef, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import Item from './item'
import { useDrop, DropTarget } from 'react-dnd'
import { useUpdateItemMutation } from '@modules/item/graphql/update.generated'
import { ItemDocument } from '@modules/item/graphql/find.generated'

type ItemsContainerProps = {
  setActiveItem: (int) => void
  activeItem: string
  storageSize: { x: number; y: number }
  storageId: string
  warehouseId: string
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
  storageSize,
  storageId,
  warehouseId,
}: ItemsContainerProps) => {
  const parentRef = useRef(null)
  const [ratio, setRatio] = useState(0)
  const [updateItemMutation, updateState] = useUpdateItemMutation()

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
    accept: 'Item',
    drop: async (item: any, monitor) => {
      const { x, y } = monitor.getDifferenceFromInitialOffset()
      await updateItemMutation({
        variables: {
          id: +item.id,
          positionX: Math.round(item.x + y / ratio),
          positionY: Math.round(item.y + x / ratio),
        },
        refetchQueries: [{ query: ItemDocument, variables: { id: +item.id } }],
      })
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  return (
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
          <Item item={item} activeItem={activeItem} setActiveItem={setActiveItem} ratio={ratio} />
        ))}
      </Box>
    </div>
  )
}

export default DropTarget('Item', itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(ItemContainer)
