import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native'
import { connect } from 'react-redux'
import { ListItem } from 'react-native-elements'
import { DateTime } from 'luxon'
import { isoToDateTime } from '../lib/timehelpers'

class HistoryScreen extends React.Component {
  static navigationOptions = {
    title: 'Baby Circus -> History',
    headerStyle: {
      backgroundColor: '#c0dfd9'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1
    }
  }
  render () {
    const type =
      (this.props.navigation.state.params &&
        this.props.navigation.state.params.type) ||
      'feed' // only for dev
    const filt = this.props.sessions
      .filter(s => s.type === type)
      .sort((a, b) => DateTime.fromISO(b.ended) - DateTime.fromISO(a.ended))
    return (
      <ScrollView>
        {filt.map((item, i) => (
          <ListItem
            key={i}
            title={isoToDateTime(item.started)}
            leftIcon={{ name: 'person' }}
          />
        ))}
      </ScrollView>
    )
  }
}

const mapStateToProps = ({ sessions }) => ({
  sessions
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen)
