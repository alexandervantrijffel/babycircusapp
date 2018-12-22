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

const toDateTime = date => {
  return DateTime.fromJSDate(date).toFormat('DD HH:mm:ss')
}
const toTime = date => {
  return DateTime.fromJSDate(date).toFormat('HH:mm:ss')
}
const formatDuration = duration => {
  const sec = duration.as('seconds')
  if (Number(sec) < 60) {
    return duration.toFormat(`s's'`)
  }
  return duration.toFormat(`m'm' s's'`)
}
export default class RegisterScreen extends React.Component {
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
  onEnd = () => {
    ended = new Date()
    this.setState({
      ended
    })
    this.props.onEnd(this.state.started, ended)
  }
  state = {}
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
                  style={styles.textStyle}
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
                  style={styles.textStyle}
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
        <Row>
          {started && (
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => this.setState({ started: null, ended: null })}
                title='Forget'
                color='#e3e0cf'
                accessibilityLabel='Undo this session'
                style={styles.textStyle}
              />
            </View>
          )}
        </Row>
      </View>
    )
  }
}

const Row = ({ children }) => (
  <View style={{ flexDirection: 'row', borderWidth: 0 }}>{children}</View>
)

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
  },
  rightCol: {
    marginTop: 24,
    width: '50%',
    flex: 1,
    flexDirection: 'row'
  }
})
