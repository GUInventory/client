import React from 'react'
import { Progress as ChakraProgress } from '@chakra-ui/react'

const getColor = (percent) => {
  switch (true) {
    case percent > 95:
      return 'red'
      break
    case percent > 75:
      return 'orange'
      break
    case percent > 60:
      return 'yellow'
    default:
      return 'green'
      break
  }
}
export const Progress = ({ value }) => {
  return <ChakraProgress size="sm" hasStripe value={value} colorScheme={getColor(value)} />
}
