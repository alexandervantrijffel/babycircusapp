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

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
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
                marginRight: 10
              }
            }
          }

          return (
            <ListItem
              key={i}
              title={isoToDateTime(item.started)}
              subtitle={formatDuration(
                DateTime.fromISO(item.ended).diff(
                  DateTime.fromISO(item.started)
                )
              )}
              leftIcon={{ name: 'person' }}
              badge={badge}
            />
          )
        })}
      </ScrollView>
    )
  }
}

const mapStateToProps = ({ sessions }) => ({
  sessions
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen)
