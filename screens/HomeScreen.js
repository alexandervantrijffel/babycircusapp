import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native'
import { WebBrowser } from 'expo'
import { MonoText } from '../components/StyledText'
import GemList from '../components/gemlist'
import NotificationPopup from 'react-native-push-notification-popup'

export default class HomeScreen extends React.Component {
  // darkblue     #023C69
  // alt darkblue #1D3D67
  // lighter blue #4D80CA
  // hyperlink blue color #2e78b7
  // light blue background color from events-fe #e6ecf0
  static navigationOptions = {
    title: 'Last Noted',
    headerStyle: {
      backgroundColor: '#023C69'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1
    }
  }
  render () {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <NotificationPopup ref={ref => (this.popup = ref)} />
        <GemList />
        <View style={styles.getStartedContainer}>
          <View style={styles.codeHighlightContainer}>
            <MonoText style={styles.codeHighlightText}>v0.0.1</MonoText>
          </View>
        </View>
      </ScrollView>
    )
  }
  componentDidMount () {
    this.popup.show({
      onPress: function () {
        console.log('Pressed')
      },
      // appIconSource: require('./assets/icon.jpg'),
      appTitle: 'Notification',
      // timeText: 'Now',
      // title: 'Notification',
      body: 'This is a sample message.\nSupports emoji 😀'
    })
  }
  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {},
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: 80
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
    marginBottom: 24
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  navigationFilename: {
    marginTop: 5
  }
})
