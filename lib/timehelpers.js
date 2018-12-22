import { DateTime } from 'luxon'

export const toDateTime = date => {
  return DateTime.fromJSDate(date).toFormat('DD HH:mm:ss')
}
export const toTime = date => {
  return DateTime.fromJSDate(date).toFormat('HH:mm:ss')
}
export const formatDuration = duration => {
  const sec = duration.as('seconds')
  if (Number(sec) < 60) {
    return duration.toFormat(`s's'`)
  }
  return duration.toFormat(`m'm' s's'`)
}
