import { Container } from 'typedi'
import AuthService from '../../../../services/Auth'
import { MutationResolvers } from '../../generated/types'

export const signup: MutationResolvers['signup'] = async (
	parent,
	{ name, email, password },
) => {
	const authServiceInstance = Container.get(AuthService)
	const user = await authServiceInstance.signup({ name, email, password })
	return user
}

export const signin: MutationResolvers['signin'] = async (
	parent,
	{ email, password },
) => {
	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.signin({ email, password })
	return {
		token: result.token,
		tokenExpiration: result.tokenExpiration,
		user: result.user,
	}
}
