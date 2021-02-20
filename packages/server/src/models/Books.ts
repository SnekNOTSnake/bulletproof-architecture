import { Document, Schema, Types, model } from 'mongoose'

export interface IBook {
	title: string
	author: object
	created: Date
	lastChanged: Date
}

export interface DocumentBook extends IBook, Document {}

const booksSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: Types.ObjectId,
		required: true,
		ref: 'Users',
	},
	created: {
		type: Date,
		required: true,
		default: Date.now,
	},
	lastChanged: {
		type: Date,
		required: true,
		default: Date.now,
	},
})

export default model<DocumentBook>('Books', booksSchema)
