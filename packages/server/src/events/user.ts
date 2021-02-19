import { DocumentUser } from '../models/Users'
import myEmitter, { userSignup } from './events'
import { sendGreetingMail } from '../utils/mail'

type Params = { user: DocumentUser }

myEmitter.on(userSignup, async ({ user }: Params) => {
	if (user.email) await sendGreetingMail({ to: user.email })
})
