import { NotifResolvers } from '../../generated/types'

export const userSender: NotifResolvers['userSender'] = async (
	parent,
	args,
	{ loaders: { userByIds } },
) => {
	const user = await userByIds.load(String(parent.userSender))
	return user
}

export const userTarget: NotifResolvers['userTarget'] = async (
	parent,
	args,
	{ loaders: { userByIds } },
) => {
	const user = await userByIds.load(String(parent.userTarget))
	return user
}

export const book: NotifResolvers['book'] = async (
	parent,
	args,
	{ loaders: { bookByIds } },
) => {
	if (!parent.book) return null
	const book = await bookByIds.load(String(parent.book))
	return book
}

export const review: NotifResolvers['review'] = async (
	parent,
	args,
	{ loaders: { reviewByIds } },
) => {
	if (!parent.review) return null
	const review = await reviewByIds.load(String(parent.review))
	return review
}
