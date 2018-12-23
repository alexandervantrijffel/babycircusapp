import React from 'react'
import { View } from 'react-native'
export default ({ children, style }) => {
  let st = { flexDirection: 'row', borderWidth: 0 }
  if (st) {
    st = Object.assign({}, st, style)
  }
  return <View style={st}>{children}</View>
}
