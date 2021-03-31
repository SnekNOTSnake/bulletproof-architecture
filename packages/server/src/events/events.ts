import EventEmitter from 'events'

const myEmitter = new EventEmitter()

// Event types
export const userSignup = 'userSignup'
export const NOTIF_CREATED = 'NOTIF_CREATED'

export default myEmitter
