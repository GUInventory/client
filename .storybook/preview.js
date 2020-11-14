import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import { addDecorator, configure } from '@storybook/react'
import React from 'react'

addDecorator((story) => (
  <ChakraProvider>
    <CSSReset />
    {story()}
  </ChakraProvider>
))

configure(require.context('../src/', true, /\.stories\.tsx$/), module)
