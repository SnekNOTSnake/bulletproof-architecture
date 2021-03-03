import DataLoader from 'dataloader'
import UserModel, { IUser } from '../models/Users'
import BookModel, { IBook } from '../models/Books'

/* async function idsBatchLoad(model: any, keys: readonly string[]) {
	const documents = await model.findById({ $in: keys })
	return documents
}

async function batchLoad(model: any, keys: readonly string[]) {
	const documents = await model.find()
	return documents
}

export const loaders: ILoaders = {
	userByIds: new DataLoader<string, IUser>((keys) => {
		return idsBatchLoad(UserModel, keys)
	}),
	allUsers: new DataLoader<string, IUser>((keys) => {
		return batchLoad(UserModel, keys)
	}),

	bookByIds: new DataLoader<string, IBook>((keys) => {
		return idsBatchLoad(BookModel, keys)
	}),
	allBooks: new DataLoader<string, IBook>((keys) => {
		return batchLoad(BookModel, keys)
	}),
} */

export interface ILoaders {
	userByIds: DataLoader<string, IUser>
	bookByIds: DataLoader<string, IBook>
}

async function batchUserIds(keys: readonly string[]) {
	const users = await UserModel.find({ _id: { $in: keys } })
	return users
}

async function batchBookIds(keys: readonly string[]) {
	const books = await BookModel.find({ _id: { $in: keys } })
	return books
}

const loaders: ILoaders = {
	userByIds: new DataLoader<string, IUser>((keys) => batchUserIds(keys)),
	bookByIds: new DataLoader<string, IBook>((keys) => batchBookIds(keys)),
}

export default loaders
