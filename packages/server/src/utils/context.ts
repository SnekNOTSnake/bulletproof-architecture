import { Request } from 'express'
import { decodeToken } from './token'
import { DocumentUser } from '../models/Users'
import loaders, { ILoaders } from './dataloaders'

// Users
const TOKEN_HEADER_NAME = 'jwt'

const getUser = async (req: Request) => {
	const token = req.get(TOKEN_HEADER_NAME)
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
	user: DocumentUser
	loaders: ILoaders
}

const context = async ({ req }: { req: Request }) => {
	const user = await getUser(req)
	return { user, loaders }
}

export default context
