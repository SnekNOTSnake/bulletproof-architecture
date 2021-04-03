import EventEmitter from 'events'

const myEmitter = new EventEmitter()

// Event types
export const USER_SIGNUP = 'USER_SIGNUP'
export const IS_USER_ONLINE = 'IS_USER_ONLINE'
export const NOTIF_CREATED = 'NOTIF_CREATED'

export default myEmitter
