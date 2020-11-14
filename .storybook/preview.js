import { ThemeProvider, CSSReset } from '@chakra-ui/react'
import { addDecorator, configure } from '@storybook/react'
import React from 'react'

addDecorator((story) => (
  <ThemeProvider>
    <CSSReset />
    {story()}
  </ThemeProvider>
))

configure(require.context('../src/', true, /\.stories\.tsx$/), module)
