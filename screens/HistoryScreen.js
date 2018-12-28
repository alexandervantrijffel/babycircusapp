import React from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  WebView
} from 'react-native'
import { connect } from 'react-redux'
import { Button, ListItem, Overlay, Text } from 'react-native-elements'
import { DateTime } from 'luxon'
import { isoToDateTime, formatDuration } from '../lib/timehelpers'
import { getVal } from '../components/badge/breast'
import { capitalizeFirstLetter } from '../lib/strings'

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
  state = {}
  getTitle = item => {
    const isSameDate =
      item.started &&
      item.ended &&
      DateTime.fromISO(item.started).toLocaleString(DateTime.DATE_SHORT) ===
        DateTime.fromISO(item.ended).toLocaleString(DateTime.DATE_SHORT)
    const ended = isSameDate
      ? DateTime.fromISO(item.ended).toLocaleString(DateTime.TIME_SIMPLE)
      : item.ended
    return isoToDateTime(item.started) + (item.ended ? ' - ' + ended : '')
  }

  render () {
    const type =
      (this.props.navigation.state.params &&
        this.props.navigation.state.params.type) ||
      'feed' // only for dev
    const filt = this.props.sessions
      .filter(s => s.type === type)
      .sort((a, b) => DateTime.fromISO(b.ended) - DateTime.fromISO(a.ended))
    // ;<Overlay
    //   isVisible={!!this.state.itemDetails}
    //   onBackdropPress={() => this.setState({ itemDetails: null })}
    // >
    //   <Button icon={{ name: 'delete' }} title='Delete' />
    // </Overlay>
    return (
      <ScrollView>
        <Text
          h4
          style={{ marginHorizontal: 42, marginBottom: 16, marginTop: 24 }}
        >
          {capitalizeFirstLetter(type)} history
        </Text>
        {filt.map((item, i) => {
          let badge = {
            wrapperStyle: {
              display: 'none'
            }
          }
          if (item.source) {
            badge = {
              value: getVal(item.source),
              textStyle: {
                color: 'orange'
              },
              containerStyle: {
                marginRight: -2
              }
            }
          }

          return (
            <ListItem
              key={i}
              title={this.getTitle(item)}
              subtitle={
                'Duration ' +
                formatDuration(
                  DateTime.fromISO(item.ended).diff(
                    DateTime.fromISO(item.started)
                  )
                )
              }
              badge={badge}
            />
          )
        })}
      </ScrollView>
    )
    // <ListItem
    // leftIcon={{ name: 'person' }}
  }
}

const mapStateToProps = ({ sessions }) => ({
  sessions
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen)
