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
import Timer from '../components/timer'

const StatusOverview = ({ type, title, label, sessions, navigate }) => {
  let d = DateTime.utc().minus({ days: 1 })
  const filt = sessions
    .filter(s => s.type === type)
    .sort((a, b) => DateTime.fromISO(a.ended) - DateTime.fromISO(b.ended))
  let last = null
  let timesLast24H = 0
  if (filt.length) {
    last = filt.slice(-1)[0]
    timesLast24H = filt.filter(s => DateTime.fromISO(s.ended) > d).length
  }
  return (
    <Row>
      <View style={{ width: '35%' }}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigate('Record', { type })}
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
            <Timer lastSession={last} />
            <Text>
              {timesLast24H} time{timesLast24H !== 1 ? 's' : ''} last 24H
            </Text>
          </View>
        )}
      </View>
      {last &&
        last.source && (
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
  componentDidMount () {
    if (!this.props.user) {
      this.props.navigation.navigate('GetUserInfo')
    }
  }
  render () {
    const { navigation: { navigate }, sessions } = this.props
    return (
      <View style={styles.container}>
        <Text>Welcome {this.props.user}</Text>
        <StatusOverview
          type='feed'
          title='Feed'
          label='Record meal'
          sessions={sessions}
          navigate={navigate}
        />
        <StatusOverview
          type='diaper'
          title='Diaper'
          label='Record diaper change'
          sessions={sessions}
          navigate={navigate}
        />
        <StatusOverview
          type='sleep'
          title='Sleep'
          label='Record sleep'
          sessions={sessions}
          navigate={navigate}
        />
        <StatusOverview
          type='massage'
          title='Massage'
          label='Record massage'
          sessions={sessions}
          navigate={navigate}
        />
        <StatusOverview
          type='medication'
          title='Medication'
          label='Take medication'
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
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 3,
    marginVertical: 20,
    // backgroundColor: '#b3c2bf',
    backgroundColor: '#e3e0cf',
    width: 120
  },
  textStyle: {
    color: '#3b3a36'
  }
})

const mapStateToProps = ({ sessions, user }) => ({
  sessions,
  user
})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)
