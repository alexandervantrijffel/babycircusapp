import sha1 from 'sha1'

export default (name, birthDate) => {
  return sha1(`#{name}-${birthDate}`)
}
