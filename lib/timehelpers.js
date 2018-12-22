import { DateTime } from 'luxon'

export const toDateTime = date => {
  return DateTime.fromJSDate(date).toFormat('DD HH:mm:ss')
}
export const toTime = date => {
  return DateTime.fromJSDate(date).toFormat('HH:mm:ss')
}
export const formatDuration = duration => {
  if (Number(duration.as('seconds')) < 60) return duration.toFormat(`s's'`)
  if (Number(duration.as('minutes')) < 60) return duration.toFormat(`m'm'`)
  return duration.toFormat(`h'h' m'm'`)
}
