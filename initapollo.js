import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
const cache = new InMemoryCache()
const stateLink = withClientState({
  cache,
  defaults: {
    testing: {
      __typename: 'testing',
      name: '',
      age: 0
    }
  }
})
const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    stateLink,
    new HttpLink({ uri: 'https://dlv.li/eventreporter/graphqlprosim' })
  ])
})
// make client to rewrite the defaults every time the store resets
client.onResetStore(stateLink.writeDefaults)

export default ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
)
