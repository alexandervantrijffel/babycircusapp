import React from 'react'
import { View } from 'react-native'
import { ExpoConfigView } from '@expo/samples'
import { clearAsyncStorage } from '../reducers'
import { connect } from 'react-redux'
import { Button } from 'react-native-elements'

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json'
  }

  render () {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={{ flex: 1 }}>
        <ExpoConfigView />
        <Button
          primary
          title='Delete local cache'
          onPress={e => this.props.clearAsyncStorage()}
        />
      </View>
    )
  }
}
const mapStateToProps = ({ user }) => ({
  user
})
const mapDispatchToProps = { clearAsyncStorage }
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
