import { Request } from 'express'
import { dangerouslyDecodeToken, decodeToken } from './token'
import { IUser } from '../models/User'
import loaders, { ILoaders } from './dataloaders'

// Users
const getUser = async (req: Request) => {
	const token = req.headers['authorization']?.split(' ')[1]
	if (!token) return null

	try {
		const decoded = await decodeToken(token)
		const user = await loaders.userByIds.load(decoded.userId)
		return user
	} catch (err) {
		return null
	}
}

// Context
export interface MyContext {
	user: IUser
	loaders: ILoaders
	getterId: String // Special ID ONLY for determining the `following` state
}

// Special User ID
const getGetterId = (req: Request) => {
	const token = req.headers['authorization']?.split(' ')[1]
	if (!token) return null

	try {
		const decoded = dangerouslyDecodeToken(token)
		return decoded.userId
	} catch (err) {
		return null
	}
}

const context = async ({ req }: { req: Request }) => {
	const user = await getUser(req)
	const getterId = getGetterId(req)

	return { user, loaders, getterId }
}

export default context
