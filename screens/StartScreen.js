import React from 'react'
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  WebView
} from 'react-native'
import { connect } from 'react-redux'
import { DateTime, Duration } from 'luxon'
import { toTime, formatDuration } from '../lib/timehelpers'
import Row from '../components/grid/row'
import { Icon } from 'react-native-elements'
import BreastBadge from '../components/badge/breast'

class Timer extends React.Component {
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
  render () {
    const { lastSession } = this.props
    return (
      <View style={{ flex: 1 }}>
        {this.state.since != 0 && (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text>{this.state.since} ago</Text>
          </View>
        )}
      </View>
    )
  }
}

const StatusOverview = ({ type, title, label, sessions, navigate }) => {
  let d = DateTime.utc().minus({ days: 1 })
  const filt = sessions
    .filter(s => s.type === type && DateTime.fromISO(s.ended) > d)
    .sort((a, b) => DateTime.fromISO(a.ended) - DateTime.fromISO(b.ended))
  let last = null
  if (filt.length) {
    last = filt.slice(-1)[0]
  }
  return (
    <Row>
      <View style={{ width: '35%' }}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigate('Register', { type })}
            title={title}
            color='#e3e0cf'
            accessibilityLabel={label}
            style={styles.textStyle}
          />
        </View>
      </View>
      <View style={{ paddingTop: 18, flex: 1, flexDirection: 'row' }}>
        {last && (
          <View style={{ left: 20, height: 40 }}>
            <Timer type={type} lastSession={last} />
            <Text>
              {filt.length} time{filt.length > 1 ? 's' : ''} last 24H
            </Text>
          </View>
        )}
      </View>
      {last.source && (
        <BreastBadge source={last.source} wrapperStyle={{ paddingTop: 24 }} />
      )}
      <View style={{ paddingTop: 24, width: 40 }}>
        <TouchableNativeFeedback
          onPress={() => navigate('History', { type })}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          <Icon name='more-vert' />
        </TouchableNativeFeedback>
      </View>
    </Row>
  )
}

class StartScreen extends React.Component {
  static navigationOptions = {
    title: 'Baby Circus',
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
    const { navigation: { navigate }, sessions } = this.props
    return (
      <View style={styles.container}>
        <StatusOverview
          type='feed'
          title='Feed'
          label='Register feeding'
          sessions={sessions}
          navigate={navigate}
        />
        <StatusOverview
          type='diaper'
          title='Diaper'
          label='Register diaper change'
          sessions={sessions}
          navigate={navigate}
        />
        <StatusOverview
          type='sleep'
          title='Sleep'
          label='Register sleep'
          sessions={sessions}
          navigate={navigate}
        />
        <StatusOverview
          type='massage'
          title='Massage'
          label='Register massage'
          sessions={sessions}
          navigate={navigate}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e9ece5',
    flex: 1
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 3,
    marginVertical: 20,
    marginHorizontal: 20,
    // backgroundColor: '#b3c2bf',
    backgroundColor: '#e3e0cf',
    width: 120
  },
  textStyle: {
    color: '#3b3a36'
  }
})

const mapStateToProps = ({ sessions }) => ({
  sessions
})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)
