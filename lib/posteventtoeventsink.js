import axios from 'axios'

const isHttpSuccessCode = code => {
  return code && code >= 200 && code < 300
}

const ReallyPost = (eventName, payload, onResult, onError) => {
  const api = axios.create({ baseURL: 'http://192.168.1.57:5061' })
  api
    .post('/event', {
      AppName: 'BabyCircus',
      Name: eventName,
      Payload: payload,
      Topic: 'baby-events'
    })
    .then(res => {
      console.log('result from POST event', res)
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

const PostToEventSink = (eventName, data, onResult, onError) => {
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
  ReallyPost(eventName, payload, onResult, onError)
}

export default PostToEventSink
