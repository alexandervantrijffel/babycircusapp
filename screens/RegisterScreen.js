import React from 'react'
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native'
import { DateTime, Duration } from 'luxon'
import { connect } from 'react-redux'
import { addSession, forgetSession } from '../reducers'
import { toTime, formatDuration } from '../lib/timehelpers'
import Row from '../components/grid/row'

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
  state = {}
  onEnd = () => {
    ended = new Date()
    this.setState({
      ended
    })
    const type =
      (this.props.navigation.state.params &&
        this.props.navigation.state.params.type) ||
      'feed'
    // store dates in ISO string, this is how they are rehydrated,
    // so store with the format as that they are rehydrated for consistent processing
    this.props.addSession({
      type,
      started: this.state.started.toISOString(),
      ended: ended.toISOString()
    })
  }
  onForget = () => {
    this.setState({ started: null, ended: null })
    this.props.forgetSession()
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
    return (
      <View style={styles.container}>
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
