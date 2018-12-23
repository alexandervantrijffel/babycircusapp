import React from 'react'
import { Platform } from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'
import StartScreen from '../screens/StartScreen'
import RegisterScreen from '../screens/RegisterScreen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'

const StartStack = createStackNavigator({
  Start: StartScreen,
  Register: RegisterScreen,
})

StartStack.navigationOptions = {
  tabBarLabel: 'Start',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home{focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  )
}

const LinksStack = createStackNavigator({
  Links: LinksScreen
})

LinksStack.navigationOptions = {
  tabBarLabel: 'Nearby',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'}
    />
  )
}

const ExploreStack = createStackNavigator({
  Explore: SettingsScreen
})

ExploreStack.navigationOptions = {
  tabBarLabel: 'Explore',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-planet' : 'md-planet'}
    />
  )
}
const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  )
}

export default createBottomTabNavigator({
  StartStack,
  LinksStack,
  ExploreStack,
  SettingsStack
})
