import React from 'react'

const Context = React.createContext()

export const ActionTypes = {
  ADDSESSION: 'ADDSESSION'
}

const reducer = (state, action) => {
  console.log('onReducer', action)
  if (action.type === ActionTypes.ADDSESSION) {
    return { ...state, sessions: [...state.sessions, action] }
  }
}

export class TrackProvider extends React.Component {
  state = {
    sessions: [],
    dispatch: action => {
      this.setState(state => reducer(state, action))
    },
    addSession: a =>
      this.state.dispatch({ type: ActionTypes.ADDSESSION, action: a })
  }
  render () {
    const { state, props: { children } } = this
    return <Context.Provider value={state}>{children}</Context.Provider>
  }
}

export const TrackConsumer = Context.Consumer
