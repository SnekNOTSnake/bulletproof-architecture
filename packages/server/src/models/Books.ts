import { Document, Schema, Types, model } from 'mongoose'

export interface IBook extends Document {
	id: string
	title: string
	author: object
	created: Date
	lastChanged: Date
}

const booksSchema = new Schema({
	title: {
		type: String,
		required: true,
		maxlength: 50,
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

export default model<IBook>('Books', booksSchema)
