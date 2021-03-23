import { FollowResolvers } from '../../generated/types'

export const follower: FollowResolvers['follower'] = async (
	parent,
	args,
	{ loaders: { userByIds } },
) => {
	const user = await userByIds.load(String(parent.follower))
	return user
}

export const following: FollowResolvers['following'] = async (
	parent,
	args,
	{ loaders: { userByIds } },
) => {
	const user = await userByIds.load(String(parent.following))
	return user
}
