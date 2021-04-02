import DataLoader from 'dataloader'

import User, { IUser } from '../../models/User'
import Book, { IBook } from '../../models/Book'
import Follow, { IFollow } from '../../models/Follow'
import Review, { IReview } from '../../models/Review'

/**
 * A function to ensure Dataloader returns the same order as requested.
 * Otherwise it could return the incorrect data, which is a disaster!
 */
const ensureOrder = ({
	docs,
	keys,
	prop,
	error = (id) => `Document does not exist (${id})`,
}: {
	docs: any[]
	keys: readonly string[]
	prop: string
	error?: (id: string) => string
}) => {
	const docsMap = new Map()
	docs.forEach((doc) => docsMap.set(String(doc[prop]), doc))

	return keys.map((key) => {
		return (
			docsMap.get(key) ||
			new Error(typeof error === 'function' ? error(key) : error)
		)
	})
}

async function batch(model: any, keys: readonly string[]) {
	const docs = await model.find({ _id: { $in: keys } })
	return ensureOrder({ docs, keys, prop: '_id' })
}

type FollowKey = { follower: any; following: any }
async function batchFollows(keys: readonly FollowKey[]) {
	/* keys = [
		{ "follower": "a", "following": "b" },
		{ "follower": "a", "following": "c" }
	]
	
	found = [
		{ "follower": "a", "b" }
	]
	
	result = keys - found (not literally, but `map key in found`)
	result = [true, false] */

	const kys = keys.slice()
	const found = await Follow.find({ $or: kys })

	const result = kys.map((key) =>
		found.some(
			(el) =>
				String(el.follower) === String(key.follower) &&
				String(el.following) === String(key.following),
		),
	)

	return result
}

export interface ILoaders {
	userByIds: DataLoader<string, IUser>
	bookByIds: DataLoader<string, IBook>
	followByIds: DataLoader<string, IFollow>
	reviewByIds: DataLoader<string, IReview>
	batchFollows: DataLoader<FollowKey, boolean>
}

const loaders: ILoaders = {
	userByIds: new DataLoader<string, IUser>((keys) => batch(User, keys)),
	bookByIds: new DataLoader<string, IBook>((keys) => batch(Book, keys)),
	followByIds: new DataLoader<string, IFollow>((keys) => batch(Follow, keys)),
	reviewByIds: new DataLoader<string, IReview>((keys) => batch(Review, keys)),
	batchFollows: new DataLoader<FollowKey, boolean>((kys) => batchFollows(kys)),
}

export default loaders
