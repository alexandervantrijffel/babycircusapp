import axios from 'axios'
import { TestLocally } from '../connectionconfig'
const isHttpSuccessCode = code => {
  return code && code >= 200 && code < 300
}

const ReallyPost = (eventName, user, payload, onResult, onError) => {
  const local = 'http://192.168.1.57:5061'
  const server = 'https://up.dlv.li/eventsink'
  const api = axios.create({ baseURL: TestLocally ? local : server })
  api
    .post('/event', {
      AppName: 'BabyCircus',
      Name: eventName,
      User: user,
      Payload: payload,
      Topic: 'baby-events'
    })
    .then(res => {
      // console.log('result from POST event', res)
      if (!isHttpSuccessCode(res.status)) {
        console.error('HTTP response indicates failure. res=', res)
        onError(res.status + ' ' + res.statusText)
      } else {
        if (res.status === 200) {
          onResult('Your update has been posted.')
        } else {
          onResult(res.status + ' ' + res.statusText)
        }
      }
    })
    .catch(error => {
      console.log('error on post event', error)
      if (onError) {
        onError(error)
      }
    })
}

const PostToEventSink = (eventName, user, data, onResult, onError) => {
  if (!data) {
    return 'Nothing to post!'
  }
  let payload = {
    ...data
  }
  // if (position) {
  //   payload.Loc = {
  //     Lat: position.coords.latitude,
  //     Lng: position.coords.longitude,
  //     Accuracy: position.coords.accuracy
  //   }
  // }
  ReallyPost(eventName, user, payload, onResult, onError)
}

export default PostToEventSink
