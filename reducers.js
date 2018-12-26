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
const addOrUpdateSession = (stateSessions, newSession) => {
  let sessions = []
  if (stateSessions && stateSessions.length) {
    sessions = [...stateSessions]
  }
  const existing = sessions.findIndex(
    s => s.started === newSession.started && s.type === newSession.type
  )
  const existed = existing !== -1
  if (existed) {
    sessions.splice(existing, 1)
  }
  const session = Object.assign({}, newSession, {
    babyID: resolveBabyID()
  })
  sessions.push(session)
  return { sessions, session, existed }
}
export default function reducer (state = { sessions: [] }, action) {
  // return { sessions: [] }
  switch (action.type) {
    case PROCESSEVENTFROMSERVER:
      if (!action.events || !action.events.length) {
        console.log(
          'Ignored PROCESSEVENTFROMSERVER; missing events array',
          action.events
        )
        return state
      }
      let allSessions = state.sessions
      action.events.forEach(event => {
        const { data } = event
        if (data.Name === 'SessionForgotten') {
          console.log(
            'Got SessionForgotten from server, this is ignored for now...',
            data
          )
        } else {
          // console.log('processing event from server', data)
          const { sessions } = addOrUpdateSession(allSessions, data.Payload)
          allSessions = sessions
        }
      })
      return { ...state, sessions: allSessions }

    case ADDSESSION:
      const { sessions, session, existed } = addOrUpdateSession(
        state.sessions,
        action.session
      )
      const eventName = !existed ? 'SessionRecorded' : 'SessionUpdated'
      PostToEventSink(
        eventName,
        state.user,
        session,
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
      PostToEventSink(
        'SessionForgotten',
        state.user,
        forgottenPayload,
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

    case CLEARASYNCSTORAGE:
      return { sessions: [] }

    // "type": "persist/REHYDRATE"
    default:
      return state
  }
}

const ADDSESSION = 'babycircus/sessions/add'
const FORGETSESSION = 'babycircus/sessions/forget'
const STOREUSERINFO = 'babycircus/storeuserinfo'
const PROCESSEVENTFROMSERVER = 'babycircus/processeventfromserver'
const CLEARASYNCSTORAGE = 'babycircus/clearasyncstorage'
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
export const processEventsFromServer = events => {
  return { type: PROCESSEVENTFROMSERVER, events }
}
export const clearAsyncStorage = () => {
  return { type: CLEARASYNCSTORAGE }
}
