import { DateTime } from 'luxon'

export const isoToDateTime = iso => {
  return DateTime.fromISO(iso).toLocaleString(DateTime.DATETIME_SHORT)
}
export const toDateTime = date => {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_SHORT)
  // .toFormat('DD HH:mm:ss')
}
export const toTime = date => {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.TIME_SIMPLE)
  // .toFormat('HH:mm:ss')
}
export const formatDuration = duration => {
  if (Number(duration.as('seconds')) < 60) return duration.toFormat(`s's'`)
  if (Number(duration.as('minutes')) < 60) return duration.toFormat(`m'm'`)
  if (Number(duration.as('hours')) < 24) return duration.toFormat(`h'h'mm'm'`)
  return duration.toFormat(`d'd'h'h'`)
}
