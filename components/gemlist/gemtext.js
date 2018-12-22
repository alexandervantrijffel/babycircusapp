import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import HTML from 'react-native-render-html'
import { OpenLink } from '../../lib/util'

// Zie voor mogelijkheden HTML element https://www.npmjs.com/package/react-native-render-html
//
const GemText = ({ display }) => {
  if (__DEV__) {
    console.log('display', display)
  }
  return (
    <HTML
      html={display}
      tagsStyles={htmlStyles}
      style={styles.wv}
      onLinkPress={(tag, href) => {
        OpenLink(href)
      }}
    />
  )
}
const htmlStyles = {
  p: {
    lineHeight: 22,
    fontSize: 16
  }
}
const styles = StyleSheet.create({
  wv: {}
})

export default GemText
