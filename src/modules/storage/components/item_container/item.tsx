import React from 'react'
import { Box, Popover, PopoverTrigger, PopoverContent, Text } from '@chakra-ui/react'
import { useDrag } from 'react-dnd'

import { DragSource } from 'react-dnd'

const itemSource = {
  beginDrag(props) {
    const item = { id: props.id, top: props.top }
    return item
  },
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    diff: monitor.getDifferenceFromInitialOffset(),
  }
}
const Item = ({ connectDragSource, setActiveItem, activeItem, item, ratio }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'Item', id: item.id, x: item.position.x, y: item.position.y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return connectDragSource(
    <div>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Box
            cursor="move"
            ref={drag}
            opacity={isDragging ? 0.2 : 1}
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
    </div>,
  )
}

export default DragSource('Item', itemSource, collect)(Item)
