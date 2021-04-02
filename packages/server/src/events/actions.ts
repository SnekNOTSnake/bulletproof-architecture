import { IUser } from '../models/User'
import ApolloPubSub from './apollo'
import myEmitter, { USER_SIGNUP, NOTIF_CREATED } from './events'
import { sendGreetingMail } from '../utils/mail'
import { INotif } from '../models/Notif'

myEmitter.on(USER_SIGNUP, async ({ user }: { user: IUser }) => {
	if (user.email) await sendGreetingMail({ to: user.email })
})

myEmitter.on(NOTIF_CREATED, async ({ notif }: { notif: INotif }) => {
	await ApolloPubSub.publish(NOTIF_CREATED, { notifCreated: notif })
})
