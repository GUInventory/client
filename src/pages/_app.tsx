import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import { useApollo } from '@lib/apollo_client'
import AuthProvider from '@modules/core/providers/auth_provider'

function App({ Component, pageProps }: AppProps): React.ReactNode {
  const client = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default App
