export default function reducer (state = { sessions: [] }, action) {
  console.log('onReduce', action)
  // return { sessions: [] }
  switch (action.type) {
    case ADDSESSION:
      return {
        ...state,
        sessions: [...state.sessions, action.session]
      }
    case FORGETSESSION:
      return {
        ...state,
        sessions: state.sessions.slice(0, state.sessions.length - 1)
      }
    // "type": "persist/REHYDRATE"
    default:
      return state
  }
}

const ADDSESSION = 'babycircus/sessions/add'
const FORGETSESSION = 'babycircus/sessions/forget'
export const addSession = session => {
  return { type: ADDSESSION, session }
}
export const forgetSession = () => {
  return { type: FORGETSESSION }
}
