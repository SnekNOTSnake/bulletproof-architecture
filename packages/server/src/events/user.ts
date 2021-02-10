import { DocumentUser } from '../models/Users'
import myEmitter, { userSignup } from './events'
import { sendGreetingMail } from '../utils/mail'

type Params = { user: DocumentUser }

myEmitter.on(userSignup, async ({ user }: Params) => {
	await sendGreetingMail({ to: user.email })
})
