import { Request } from 'express'
import { decodeToken } from './token'
import UserModel from '../models/Users'
import { DocumentUser } from '../models/Users'

const TOKEN_HEADER_NAME = 'jwt'

export interface MyContext {
	user: DocumentUser
}

export const getUser = async (req: Request) => {
	const token = req.get(TOKEN_HEADER_NAME)
	if (!token) return null

	try {
		const decoded = await decodeToken(token)
		const user = await UserModel.findById(decoded.userId)
		return user
	} catch (err) {
		return null
	}
}

const context = async ({ req }: { req: Request }) => {
	const user = await getUser(req)
	return { user }
}

export default context
