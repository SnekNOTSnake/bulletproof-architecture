import { UserResolvers } from '../../generated/types'

export const isFollowing: UserResolvers['isFollowing'] = async (
	parent,
	args,
	{ loaders: { batchFollows }, getterId },
) => {
	if (!getterId) return false

	const result = await batchFollows.load({
		follower: getterId,
		following: parent.id,
	})

	return result
}
