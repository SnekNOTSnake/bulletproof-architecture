import DataLoader from 'dataloader'

import UserModel, { IUser } from '../models/Users'
import BookModel, { IBook } from '../models/Books'

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

export interface ILoaders {
	userByIds: DataLoader<string, IUser>
	bookByIds: DataLoader<string, IBook>
}

async function batchUserIds(keys: readonly string[]) {
	const users = await UserModel.find({ _id: { $in: keys } })
	return ensureOrder({ docs: users, keys, prop: '_id' })
}

async function batchBookIds(keys: readonly string[]) {
	const books = await BookModel.find({ _id: { $in: keys } })
	return ensureOrder({ docs: books, keys, prop: '_id' })
}

const loaders: ILoaders = {
	userByIds: new DataLoader<string, IUser>((keys) => {
		const users = batchUserIds(keys)
		return users
	}),
	bookByIds: new DataLoader<string, IBook>((keys) => batchBookIds(keys)),
}

export default loaders
