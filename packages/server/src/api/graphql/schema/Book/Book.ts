import { BookResolvers } from '../../generated/types'
import { Container } from 'typedi'
import AuthService from '../../../../services/Auth'

export const author: BookResolvers['author'] = async (parent) => {
	const authServiceInstance = Container.get(AuthService)
	const user = await authServiceInstance.getUser(String(parent.author))

	if (!user)
		throw new Error(
			`User associated with book ${parent.id} is gone from database. It could be caused by noob admin, we'll be very grateful if you want to kindly report it`,
		)

	return user
}
