import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements'
import { storeUserInfo } from '../reducers'

class GetUserInfoScreen extends React.Component {
  static navigationOptions = {
    title: 'Baby Circus -> Welcome',
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
  onSubmit = () => {
    const text = (this.state.text || '').trim()
    if (!text) {
      this.setState({ showRequired: true })
      return
    }
    this.props.storeUserInfo(text)
    this.props.navigation.goBack()
  }
  render () {
    return (
      <View>
        <FormLabel>Please enter your name</FormLabel>
        <FormInput
          containerStyle={{ borderBottomWidth: 1, marginBottom: 12 }}
          onChangeText={t => {
            this.state.text = t
            if (this.state.showRequired && t) {
              this.setState({ showRequired: false })
            }
          }}
        />
        {this.state.showRequired && (
          <FormValidationMessage>Please enter a value</FormValidationMessage>
        )}
        <Button icon={{ name: 'save' }} title='Save' onPress={this.onSubmit} />
      </View>
    )
  }
}

const mapStateToProps = ({ sessions }) => ({
  sessions
})
const mapDispatchToProps = { storeUserInfo }
export default connect(mapStateToProps, mapDispatchToProps)(GetUserInfoScreen)
