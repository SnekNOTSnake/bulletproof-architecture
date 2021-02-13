import { BookResolvers } from '../../generated/types'

export const author: BookResolvers['author'] = async (parent, args, ctx) => {
	const user = await ctx.loaders.userByIds.load(String(parent.author))
	return user
}
