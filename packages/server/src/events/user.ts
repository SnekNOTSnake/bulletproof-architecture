import { IUser } from '../models/Users'
import myEmitter, { userSignup } from './events'
import { sendGreetingMail } from '../utils/mail'

type Params = { user: IUser }

myEmitter.on(userSignup, async ({ user }: Params) => {
	if (user.email) await sendGreetingMail({ to: user.email })
})
