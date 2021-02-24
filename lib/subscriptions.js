import React from 'react'
import { View } from 'react-native'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { processEventsFromServer } from '../reducers'
import { connect } from 'react-redux'

const BABYQUERY = gql`
  query {
    babyEvents {
      data
    }
  }
`

const BABYSUBSCRIPTIONS = gql`
  subscription onBabyEvent {
    onBabyEvent {
      data
    }
  }
`

class Subscriptions extends React.Component {
  state = {}
  componentDidUpdate (prevProps, prevState) {
    // totally inappropriate way to combine apollo with redux
    // see for better examples
    // https://medium.com/react-native-training/building-chatty-part-6-graphql-subscriptions-b54df7d63e27
    // https://www.robinwieruch.de/react-redux-apollo-client-state-management-tutorial/
    const { data, processEventsFromServer } = this.props
    // console.log('Subscriptions got data!', data)
    if (data.error) {
      console.log('Got graphql error!', data)
      return
    }
    if (!this.state.subscriptionStarted) {
      this.state.subscriptionStarted = true
      data.subscribeToMore({
        document: BABYSUBSCRIPTIONS,
        variables: {},
        updateQuery: (prevResult, { subscriptionData }) => {
          const { onBabyEvent } = subscriptionData.data
          processEventsFromServer([onBabyEvent])

          // todo, update graphql cache???
          return prevResult
        }
      })
    }
    if (
      data.babyEvents &&
      (!prevProps.data.babyEvents ||
        prevProps.data.babyEvents.length != data.babyEvents.length)
    ) {
      processEventsFromServer(data.babyEvents)
    }
  }
  render () {
    return <View>{this.props.children}</View>
  }
}

const mapStateToProps = ({ sessions }) => ({
  sessions
})
const mapDispatchToProps = { processEventsFromServer }
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(BABYQUERY)
)(Subscriptions)
