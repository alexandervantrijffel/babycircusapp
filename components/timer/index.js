import React from 'react'
import { View } from 'react-native'
import { DateTime, Duration } from 'luxon'
import { toTime, formatDuration } from '../../lib/timehelpers'
import { Text } from 'react-native-elements'

export default class Timer extends React.Component {
  state = { since: 0, sinceEnd: 0 }
  timer = 0
  componentDidMount () {
    if (this.timer == 0) {
      this.timer = setInterval(this.onTick, 1000)
    }
  }
  onTick = () => {
    if (!this.props.lastSession) return
    const diffEnded = new Date() - new Date(this.props.lastSession.ended)
    const durationEnded = formatDuration(Duration.fromMillis(diffEnded))
    if (durationEnded !== this.state.sinceEnd) {
      const diffStarted = new Date() - new Date(this.props.lastSession.started)
      const durationStarted = formatDuration(Duration.fromMillis(diffStarted))
      this.setState({ since: durationStarted, sinceEnd: durationEnded })
    }
  }
  componentWillUnmount () {
    clearInterval(this.timer)
  }
  render () {
    const { lastSession, ...rest } = this.props
    return (
      <View>
        <Text {...rest}>
          Started {this.state.since != 0 ? this.state.since + ' ago' : ''}
        </Text>
        <Text {...rest}>
          Ended {this.state.sinceEnd != 0 ? this.state.sinceEnd + ' ago' : ''}
        </Text>
      </View>
    )
  }
}
