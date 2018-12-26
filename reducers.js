import PostToEventSink from './lib/posteventtoeventsink'
import GetBabyID from './lib/babyid'
import { DateTime } from 'luxon'
const resolveBabyID = () => {
  const date = DateTime.fromObject({
    year: 2018,
    month: 12,
    day: 27
  }).toFormat('yyyyLLdd')
  return GetBabyID('Julian', date)
}
export default function reducer (state = { sessions: [] }, action) {
  // console.log('onReduce', action)
  // return { sessions: [] }
  switch (action.type) {
    case ADDSESSION:
      let sessions = [...state.sessions]
      const existing = sessions.findIndex(
        s =>
          s.started === action.session.started && s.type === action.session.type
      )
      if (existing !== -1) {
        sessions.splice(existing, 1)
      }
      const payload = Object.assign({}, action.session, {
        babyID: resolveBabyID()
      })
      // console.log('payload', payload)
      sessions.push(payload)

      const eventName = existing === -1 ? 'SessionRecorded' : 'SessionUpdated'
      PostToEventSink(
        eventName,
        state.user,
        action.session,
        s => console.log(`Post ${eventName} to server succeeded`),
        e => console.log(`Post ${eventName} to server failed`, e)
      )
      return {
        ...state,
        sessions
      }
    case FORGETSESSION:
      const forgottenPayload = Object.assign(
        {},
        state.sessions[state.sessions.length - 1],
        {
          babyID: resolveBabyID()
        }
      )
      console.log('payload', forgottenPayload)
      PostToEventSink(
        'SessionForgotten',
        state.user,
        payload,
        s => console.log(`Post SessionForgotten to server succeeded', s`),
        e => console.log(`Post Sessionforgotten to server failed`, e)
      )
      return {
        ...state,
        sessions: state.sessions.slice(0, state.sessions.length - 1)
      }

    case STOREUSERINFO:
      return {
        ...state,
        user: action.payload.user
      }
    // "type": "persist/REHYDRATE"
    default:
      return state
  }
}

const ADDSESSION = 'babycircus/sessions/add'
const FORGETSESSION = 'babycircus/sessions/forget'
const STOREUSERINFO = 'babycircus/storeuserinfo'
export const addSession = session => {
  return { type: ADDSESSION, session }
}
export const forgetSession = () => {
  return { type: FORGETSESSION }
}
export const storeUserInfo = name => {
  const payload = { user: name }
  return { type: STOREUSERINFO, payload }
}
