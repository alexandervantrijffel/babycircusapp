import React from 'react'
import { DateTime } from 'luxon'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { WebBrowser } from 'expo'

import { MonoText } from '../StyledText'
import GemText from './gemtext'

const toDateTime = date => {
  return DateTime.fromISO(date).toFormat('DD HH:mm:ss')
}
export default class Gem extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    const { LastUpdated, Payload } = this.props.data
    return (
      <View style={{ marginVertical: 20 }}>
        <GemText display={Payload.Text} />
        <View
          style={{
            fontSize: 12,
            marginTop: 6
          }}
        >
          <Text style={{ color: '#777777' }}>{toDateTime(LastUpdated)}</Text>
        </View>
      </View>
    )
  }
}
