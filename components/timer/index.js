import React from 'react'
import { View } from 'react-native'
import { DateTime, Duration } from 'luxon'
import { toTime, formatDuration } from '../../lib/timehelpers'
import { Text } from 'react-native-elements'

export default class Timer extends React.Component {
  state = { since: 0 }
  timer = 0
  componentDidMount () {
    if (this.timer == 0) {
      this.timer = setInterval(this.onTick, 1000)
    }
  }
  onTick = () => {
    if (!this.props.lastSession) return
    const diff = new Date() - new Date(this.props.lastSession.ended)
    const duration = formatDuration(Duration.fromMillis(diff))
    if (duration !== this.state.since) {
      this.setState({ since: duration })
    }
  }
  componentWillUnmount () {
    clearInterval(this.timer)
  }
  render () {
    const { lastSession, ...rest } = this.props
    return (
      <Text {...rest}>
        {this.state.since != 0 ? this.state.since + ' ago' : ''}
      </Text>
    )
  }
}
