import { Request } from 'express'
import { ApolloServerExpressConfig } from 'apollo-server-express'

import { dangerouslyDecodeToken, decodeToken } from './token'
import { IUser } from '../models/User'
import loaders, { ILoaders } from './dataloaders'

// Users
export const getUser = async (token: string) => {
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
	getterId: string // Special ID ONLY for determining the `following` state
}

// Special User ID
const getGetterId = (token: string) => {
	try {
		const decoded = dangerouslyDecodeToken(token)
		return decoded.userId
	} catch (err) {
		return null
	}
}

const context: ApolloServerExpressConfig['context'] = async ({
	req,
	connection,
}) => {
	// If request come from WebSocket subscription
	if (connection) {
		return connection.context
	}

	const token = req.headers['authorization']?.split(' ')[1] || null

	const user = token ? await getUser(token) : null
	const getterId = token ? getGetterId(token) : null

	return { user, loaders, getterId }
}

export default context
