import { Container } from 'typedi'

import validate from '../validate'
import myEmitter, { userSignup } from '../../../../events/events'
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

	myEmitter.emit(userSignup, { user })

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
	{ file, name },
	{ user, loaders: { userByIds } },
) => {
	await validate(updateMeSchema, { name })

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.updateMe({
		newName: name,
		file,
		user,
	})
	userByIds.clear(user.id)

	return result
}
