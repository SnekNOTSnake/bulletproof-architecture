import { Request } from 'express'
import { decodeToken } from './token'
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
}

const context = async ({ req }: { req: Request }) => {
	const user = await getUser(req)
	return { user, loaders }
}

export default context
