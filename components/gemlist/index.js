import React from 'react'
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import Gem from './gem'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class GemList extends React.Component {
  render () {
    const { data: { loading, notes } } = this.props
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            marginHorizontal: 40,
            alignItems: 'center'
          }}
        >
          {
            // Image source: https://www.brandcrowd.com/maker/logo/6c1987bf-9e22-44db-a699-fa750edaad58?text=Last%20Noted
            // alternative:
            // https://www.brandcrowd.com/maker/logo/3c060438-ee42-45e8-ab9a-d3946d5082be?text=Last%20Noted
            // https://www.brandcrowd.com/maker/logo/06188028-9614-4e90-a392-1e07fe819acd?text=Last%20Notified
          }
          <Image
            style={{ width: 100, height: 100, marginVertical: 40 }}
            source={require('../../assets/images/lastnotedfullwhite.png')}
          />
          <ActivityIndicator
            size='large'
            color='#023C69'
            style={{ marginTop: 40 }}
          />
          <Text
            style={{
              fontSize: 24,
              marginTop: 24,
              marginBottom: 12,
              marginLeft: 12
            }}
          >
            Loading last notes...
          </Text>
          <Text
            style={{
              marginBottom: 20,
              color: 'rgba(0,0,0,0.4)',
              fontSize: 14,
              lineHeight: 19,
              textAlign: 'center'
            }}
          >
            Please wait while we retrieve the latest notes relevant to you.
          </Text>
        </View>
      )
    }
    const finalNotes = notes // .slice(0, 8)
    return (
      <View style={styles.gemContainer}>
        {finalNotes.map(n => <Gem key={n.data.Value.ID} data={n.data.Value} />)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  gemContainer: {
    // marginHorizontal: 12,
    padding: 12,
    flex: 1,
    backgroundColor: '#e6ecf0'
  }
})

const NOTESQUERY = gql`
  query notes {
    notes {
      data
    }
  }
`
export default graphql(NOTESQUERY)(GemList)
