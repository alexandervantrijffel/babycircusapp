import React from 'react'
import { Badge, Text, Tooltip } from 'react-native-elements'

export const getVal = source => {
  if (source === 'LeftBreast' || source === 'Left breast') return 'L'
  return 'R'
}
export default ({ source, ...rest }) => {
  const val = getVal(source)
  return <Badge value={val} textStyle={{ color: 'orange' }} {...rest} />
}
