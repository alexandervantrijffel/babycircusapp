import { Linking } from 'react-native'

// todo show errors on screen, also when url is empty
export const OpenLink = url => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url)
    } else {
      console.error("Don't know how to open url: " + url)
    }
  })
}

export const BetterStringify = obj => {
  let seen = []
  return JSON.stringify(obj, function (key, val) {
    if (val != null && typeof val === 'object') {
      if (seen.indexOf(val) >= 0) {
        return
      }
      seen.push(val)
    }
    return val
  })
}
