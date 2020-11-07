import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink } from '@apollo/client'
import merge from 'deepmerge'
import { onError } from 'apollo-link-error'
import { GRAPHQL_ENDPOINT } from '@config/environment'

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('TOKEN')
  operation.setContext({
    headers: {
      authorization: token || null,
    },
  })
  return forward(operation)
})

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'same-origin',
})

const errorLink = onError(({ graphQLErrors }) => {
  const error = graphQLErrors
  // TODO: It's not an implementation..
  if (error?.code === 401) {
    localStorage.removeItem('TOKEN')
    alert('logout')
  }
})

// use with apollo-client
const link = middlewareLink.concat(httpLink)

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // TODO: Remove ts-ignore
    // @ts-ignore
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache(),
  })
}
let apolloClient
export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache)

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
