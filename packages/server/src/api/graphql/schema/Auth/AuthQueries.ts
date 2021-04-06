import { Container } from 'typedi'

import AuthService from '../../../../services/Auth'
import { QueryResolvers } from '../../generated/types'
import { connection } from '../../../../utils/graphql-connection'
import { usersSchema } from '../../../validateSchemas'
import validate from '../validate'

export const me: QueryResolvers['me'] = (parent, args, { user }) => {
	return user
}

export const user: QueryResolvers['user'] = async (parent, { id }) => {
	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.getUser(id)

	return result
}

export const users: QueryResolvers['users'] = connection({
	cursorFromNode: (node) => node.created.toISOString(),
	nodes: async (parent, { first, after, orderBy }, context, info) => {
		await validate(usersSchema, { first, after, orderBy })

		const [orderField, orderType]: any = orderBy.split('_')

		const authServiceInstance = Container.get(AuthService)
		const users = await authServiceInstance.getUsers({
			first,
			after,
			orderBy: orderField,
			orderType,
		})

		return users
	},
})
