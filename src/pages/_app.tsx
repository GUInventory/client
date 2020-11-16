import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import { useApollo } from '@lib/apollo_client'

function App({ Component, pageProps }: AppProps): React.ReactNode {
  const client = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default App
