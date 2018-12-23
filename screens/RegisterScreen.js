import React from 'react'
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  WebView
} from 'react-native'
import { DateTime, Duration } from 'luxon'
import { connect } from 'react-redux'
import { addSession, forgetSession } from '../reducers'
import { toTime, formatDuration } from '../lib/timehelpers'
import Row from '../components/grid/row'
import { ButtonGroup, Icon, Text, Tile } from 'react-native-elements'
import BreastBadge from '../components/badge/breast'
import Timer from '../components/timer'

const HistoryView = ({ lastSession }) => (
  <View
    style={{
      width: '50%',
      height: 40
    }}
  >
    {lastSession && (
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 8
        }}
      >
        <Icon name='access-time' size={28} iconStyle={{ marginLeft: 40 }} />
        <Timer
          lastSession={lastSession}
          style={{ marginLeft: 12, paddingTop: 4 }}
        />
      </View>
    )}
  </View>
)

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Baby Circus > Register',
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
  type = (this.props.navigation.state.params &&
    this.props.navigation.state.params.type) ||
    'feed' // only for dev
  state = {}
  onEnd = () => {
    const upd = {
      ended: new Date()
    }
    this.setState(upd)
    this.reportSession(upd)
  }
  onSourcePress = i => {
    const upd = { selectedSource: i }
    this.setState(upd)
    if (this.state.ended) {
      this.reportSession(upd)
    }
  }
  onForget = () => {
    this.setState({ started: null, ended: null })
    this.props.forgetSession()
  }
  reportSession = stateUpdates => {
    const updatedState = Object.assign({}, this.state, stateUpdates)
    let session = {
      type: this.type,
      started: updatedState.started.toISOString(),
      ended: updatedState.ended.toISOString()
    }
    if (typeof updatedState.selectedSource !== 'undefined') {
      let source = 'LeftBreast'
      if (updatedState.selectedSource == 1) source = 'RightBreast'
      session.source = source
    }
    // store dates in ISO string, this is how they are rehydrated,
    // so store with the format as that they are rehydrated for consistent processing
    this.props.addSession(session)
  }
  render () {
    const { navigate } = this.props.navigation
    let { started, ended } = this.state
    let duration = {}
    if (started && ended) {
      var timeDiff = Math.abs(started.getTime() - ended.getTime())
      duration = Duration.fromMillis(timeDiff)
    }
    const hasCompleted = started && ended
    const component1 = () => (
      <Row>
        <BreastBadge source='LeftBreast' />
        <Text style={{ marginLeft: 12 }}>Left breast</Text>
      </Row>
    )
    const component2 = () => (
      <Row>
        <BreastBadge source='RightBreast' />
        <Text style={{ marginLeft: 12 }}>Right breast</Text>
      </Row>
    )
    const buttons = [{ element: component1 }, { element: component2 }]

    const filt = this.props.sessions
      .filter(s => s.type === this.type)
      .sort((a, b) => DateTime.fromISO(b.ended) - DateTime.fromISO(a.ended))

    let lastLeft = null
    for (var s of filt) {
      if (s.type === this.type && s.source === 'LeftBreast') {
        lastLeft = s
        break
      }
    }
    let lastRight = null
    for (var s of filt) {
      console.log('testing', s)
      if (s.type === this.type && s.source === 'RightBreast') {
        lastRight = s
        break
      }
    }

    const showLastContainer = !!lastLeft || !!lastRight
    return (
      <View style={styles.container}>
        {this.type === 'feed' && (
          <Row>
            <ButtonGroup
              onPress={this.onSourcePress}
              buttons={buttons}
              containerStyle={{ flex: 1, height: 60 }}
              selectedIndex={this.state.selectedSource}
              buttonStyle={{ backgroundColor: '#A0A0A0' }}
              selectedButtonStyle={{ backgroundColor: '#FFF' }}
            />
          </Row>
        )}
        {showLastContainer && (
          <Row style={{ marginHorizontal: 12 }}>
            <HistoryView lastSession={lastLeft} />
            <HistoryView lastSession={lastRight} />
          </Row>
        )}
        <Row>
          <View style={{ width: '50%' }}>
            {!started && (
              <View style={styles.buttonContainer}>
                <Button
                  onPress={() => this.setState({ started: new Date() })}
                  title='Start'
                  color='#e3e0cf'
                  accessibilityLabel='Start feeding'
                />
              </View>
            )}
          </View>
          {started && (
            <View style={styles.rightCol}>
              <Text style={{ top: 6 }}>Started: </Text>
              <Text style={{ left: 18, fontSize: 22 }}>{toTime(started)}</Text>
            </View>
          )}
        </Row>
        <Row>
          <View style={{ width: '50%' }}>
            {started && (
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.onEnd}
                  title={!ended ? 'End' : 'New end'}
                  color='#e3e0cf'
                  accessibilityLabel='Start feeding'
                />
              </View>
            )}
          </View>
          {hasCompleted && (
            <View style={styles.rightCol}>
              <Text style={{ top: 6 }}>Duration: </Text>
              <Text style={{ left: 12, fontSize: 22 }}>
                {formatDuration(duration)}
              </Text>
            </View>
          )}
        </Row>
        {hasCompleted && (
          <Row>
            <Text style={{ left: 24 }}>The session has been recorded</Text>
          </Row>
        )}
        {hasCompleted && (
          <View>
            <Row>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={e => navigate('Start')}
                  title='Start screen'
                  color='#e3e0cf'
                  accessibilityLabel='Back to the start screen'
                />
              </View>
            </Row>
            <Row>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.onForget}
                  title='Forget'
                  color='#e3e0cf'
                  accessibilityLabel='Undo this session'
                />
              </View>
            </Row>
          </View>
        )}
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
    // color: '#3b3a36'
    width: 120
  },
  rightCol: {
    marginTop: 24,
    width: '50%',
    flex: 1,
    flexDirection: 'row'
  }
})

const mapStateToProps = ({ sessions }) => ({
  sessions
})

const mapDispatchToProps = {
  addSession,
  forgetSession
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)
