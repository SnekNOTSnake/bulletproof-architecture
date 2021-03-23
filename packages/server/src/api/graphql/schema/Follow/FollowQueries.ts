import { Container } from 'typedi'

import validate from '../validate'
import { getFollowsSchema } from '../../../validateSchemas'
import { QueryResolvers } from '../../generated/types'
import { connection } from '../../../../utils/graphql-connection'
import FollowService from '../../../../services/Follow'

export const getFollows: QueryResolvers['getFollows'] = connection({
	cursorFromNode: (node) => node.created.toISOString(),
	nodes: async (parent, { first, after, orderBy, where }) => {
		const [orderField, orderType]: any = orderBy.split('_')

		validate(getFollowsSchema, { first, after, orderBy, where })

		const followServiceInstance = Container.get(FollowService)
		const follows = await followServiceInstance.getFollows({
			first,
			after,
			orderBy: orderField,
			orderType,
			where,
		})

		return follows
	},
})
