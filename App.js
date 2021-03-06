import React from 'react'
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { AppLoading, Asset, Font, Icon } from 'expo'
import AppNavigator from './navigation/AppNavigator'
import InitApollo from './initapollo'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
import rootReducer from './reducers'
import Subscriptions from './lib/subscriptions'
const persistConfig = {
  key: 'root',
  storage
}

// info https://github.com/rt2zz/redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer)
let store = createStore(persistedReducer)

// todo, we are not using this persistor???
let persistor = persistStore(store)

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  }

  render () {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    }
    return (
      <Provider store={store}>
        <PersistGate
          loading={<Text>Loading store...</Text>}
          persistor={persistor}
        >
          <InitApollo store={store}>
            <View style={styles.container}>
              <Subscriptions />
              {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
              <AppNavigator />
            </View>
          </InitApollo>
        </PersistGate>
      </Provider>
    )
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([require('./assets/images/lastnotedfullwhite.png')]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
      })
    ])
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
