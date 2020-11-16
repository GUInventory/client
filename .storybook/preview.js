import { ChakraProvider } from '@chakra-ui/react'
import { addDecorator, configure } from '@storybook/react'
import React from 'react'

addDecorator((story) => (
  <ChakraProvider>
    {story()}
  </ChakraProvider>
))

configure(require.context('../src/', true, /\.stories\.tsx$/), module)
