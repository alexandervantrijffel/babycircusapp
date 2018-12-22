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

export default class StartScreen extends React.Component {
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
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigate('Register', { type: 'feed' })}
            title='Feed'
            color='#e3e0cf'
            accessibilityLabel='Register feeding'
            style={styles.textStyle}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigate('Register', { type: 'diaper' })}
            title='Diaper'
            color='#e3e0cf'
            accessibilityLabel='Register diaper change'
            style={styles.textStyle}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigate('Register', { type: 'sleep' })}
            title='Sleep'
            color='#e3e0cf'
            accessibilityLabel='Register sleep'
            style={styles.textStyle}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigate('Register', { type: 'massage' })}
            title='Massage'
            color='#e3e0cf'
            accessibilityLabel='Register massage'
            style={styles.textStyle}
          />
        </View>
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
