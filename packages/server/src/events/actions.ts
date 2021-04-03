import User, { IUser } from '../models/User'
import ApolloPubSub from './apollo'
import myEmitter, { USER_SIGNUP, NOTIF_CREATED, IS_USER_ONLINE } from './events'
import { sendGreetingMail } from '../utils/mail'
import { INotif } from '../models/Notif'

myEmitter.on(USER_SIGNUP, async ({ user }: { user: IUser }) => {
	if (user.email) await sendGreetingMail({ to: user.email })
})

myEmitter.on(NOTIF_CREATED, async ({ notif }: { notif: INotif }) => {
	await ApolloPubSub.publish(NOTIF_CREATED, { notifCreated: notif })
})

myEmitter.on(
	IS_USER_ONLINE,
	async (payload: { userId: string; isOnline: boolean }) => {
		await User.findByIdAndUpdate(payload.userId, { isOnline: payload.isOnline })
		await ApolloPubSub.publish(IS_USER_ONLINE, { isUserOnline: payload })
	},
)
