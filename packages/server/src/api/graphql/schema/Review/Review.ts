import { ReviewResolvers } from '../../generated/types'

export const book: ReviewResolvers['book'] = async (parent, args, ctx) => {
	const book = await ctx.loaders.bookByIds.load(String(parent.book))
	return book
}

export const author: ReviewResolvers['author'] = async (parent, args, ctx) => {
	const user = await ctx.loaders.userByIds.load(String(parent.author))
	return user
}
