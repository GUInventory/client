import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import { useApollo } from '@lib/apollo_client'
import { Layout as BaseLayout } from '@modules/core/components'
import { Layout as AuthLayout } from '@modules/auth/components'
import { useRouter } from 'next/router'

function App({ Component, pageProps }: AppProps): React.ReactNode {
  const client = useApollo(pageProps.initialApolloState)
  const router = useRouter()
  const Layout = ({ children }) =>
    router.pathname.split('/')[1] === 'auth' ? (
      <AuthLayout>{children}</AuthLayout>
    ) : (
      <BaseLayout>{children}</BaseLayout>
    )
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default App
