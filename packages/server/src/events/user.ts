import { IUser } from '../models/User'
import ApolloPubSub from './apollo'
import myEmitter, { userSignup, NOTIF_CREATED } from './events'
import { sendGreetingMail } from '../utils/mail'
import { INotif } from '../models/Notif'

type Params = { user: IUser }

myEmitter.on(userSignup, async ({ user }: Params) => {
	if (user.email) await sendGreetingMail({ to: user.email })
})

myEmitter.on(NOTIF_CREATED, async (payload: INotif) => {
	await ApolloPubSub.publish(NOTIF_CREATED, payload)
})
