import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink, createHttpLink } from 'apollo-link-http'
import { ApolloLink, split } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { ReduxCache, apolloReducer } from 'apollo-cache-redux'
import ReduxLink from 'apollo-link-redux'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { TestLocally } from './connectionconfig'

export default ({ store, children }) => {
  // source: https://github.com/srtucker22/chatty/blob/master/client/src/app.js

  const URL = TestLocally
    ? 'http://192.168.1.57:5062/graphqlprosim'
    : 'https://dlv.li/eventreporter/graphqlprosim'

  // const cache = new ReduxCache({ store })
  const cache = new InMemoryCache()

  const reduxLink = new ReduxLink(store)

  const httpLink = createHttpLink({ uri: URL })

  // middleware for requests
  const middlewareLink = setContext((req, previousContext) => {
    // get the authentication token from local storage if it exists
    const { jwt } = store.getState().auth || {}
    if (jwt) {
      return {
        headers: {
          authorization: `Bearer ${jwt}`
        }
      }
    }

    return previousContext
  })

  // afterware for responses
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    let shouldLogout = false
    if (graphQLErrors) {
      console.log({ graphQLErrors })
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log({ message, locations, path })
        // if (message === 'Unauthorized') {
        //   shouldLogout = true
        // }
      })

      // if (shouldLogout) {
      //   store.dispatch(logout())
      // }
    }
    if (networkError) {
      console.log('[Network error]:')
      console.log({ networkError })
      // if (networkError.statusCode === 401) {
      //   logout()
      // }
    }
  })

  let wsUrl = URL.replace('https://', 'wss://').replace('http://', 'ws://')
  // Create WebSocket client
  const wsClient = new SubscriptionClient(wsUrl, {
    lazy: true,
    reconnect: true
    // connectionParams() {
    //   // get the authentication token from local storage if it exists
    //   return { jwt: store.getState().auth.jwt }
    // }
  })

  const webSocketLink = new WebSocketLink(wsClient)

  const requestLink = ({ queryOrMutationLink, subscriptionLink }) =>
    ApolloLink.split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      subscriptionLink,
      queryOrMutationLink
    )

  const link = ApolloLink.from([
    reduxLink,
    errorLink,
    requestLink({
      queryOrMutationLink: middlewareLink.concat(httpLink),
      subscriptionLink: webSocketLink
    })
  ])

  const client = new ApolloClient({
    link,
    cache
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
