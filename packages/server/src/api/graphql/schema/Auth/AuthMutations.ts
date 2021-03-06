import { Container } from 'typedi'

import validate from '../validate'
import {
	signupSchema,
	signinSchema,
	updateMeSchema,
} from '../../../validateSchemas'
import AuthService from '../../../../services/Auth'
import { MutationResolvers } from '../../generated/types'

export const signup: MutationResolvers['signup'] = async (
	parent,
	{ name, email, password },
) => {
	await validate(signupSchema, { name, email, password })

	const authServiceInstance = Container.get(AuthService)
	const user = await authServiceInstance.signup({ name, email, password })

	return user
}

export const signin: MutationResolvers['signin'] = async (
	parent,
	{ email, password },
) => {
	await validate(signinSchema, { email, password })

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.signin({ email, password })

	return {
		accessToken: result.accessToken,
		refreshToken: result.refreshToken,
		user: result.user,
	}
}

export const updateMe: MutationResolvers['updateMe'] = async (
	parent,
	{ file, name, bio },
	{ user, loaders: { userByIds } },
) => {
	await validate(updateMeSchema, { name, bio })

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.updateMe({
		newName: name,
		file,
		user,
		bio,
	})
	userByIds.clear(user.id)

	return result
}
