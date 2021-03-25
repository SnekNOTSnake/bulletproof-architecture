import { Container } from 'typedi'

import validate from '../validate'
import { followUserSchema, unfollowUserSchema } from '../../../validateSchemas'
import { MutationResolvers } from '../../generated/types'
import FollowService from '../../../../services/Follow'

export const followUser: MutationResolvers['followUser'] = async (
	parent,
	{ following },
	{ user, loaders: { userByIds } },
) => {
	await validate(followUserSchema, { following })

	const followServiceInstance = Container.get(FollowService)
	const follow = await followServiceInstance.followUser({
		follower: user.id,
		following,
	})
	userByIds.clear(following)
	userByIds.clear(user.id)

	return follow
}

export const unfollowUser: MutationResolvers['unfollowUser'] = async (
	parent,
	{ following },
	{ user, loaders: { userByIds } },
) => {
	await validate(unfollowUserSchema, { following })

	const followServiceInstance = Container.get(FollowService)
	const follow = await followServiceInstance.unfollowUser({
		follower: user.id,
		following,
	})
	userByIds.clear(following)
	userByIds.clear(user.id)

	return follow
}
