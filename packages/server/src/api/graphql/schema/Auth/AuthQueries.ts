import { Container } from 'typedi'

import AuthService from '../../../../services/Auth'
import { QueryResolvers } from '../../generated/types'

export const me: QueryResolvers['me'] = (parent, args, { user }) => {
	return user
}

export const user: QueryResolvers['user'] = async (parent, { id }) => {
	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.getUser(id)

	return result
}
