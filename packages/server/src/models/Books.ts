import { Document, Schema, Types, model } from 'mongoose'

export interface IBook extends Document {
	id: string
	title: string
	author: object
	summary: string
	content: string
	created: Date
	lastChanged: Date
}

const bookSchema: Schema<IBook> = new Schema<IBook>({
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
	summary: {
		type: String,
		required: true,
		maxlength: 200,
	},
	content: {
		type: String,
		required: true,
		minlength: 100,
		maxlength: 2000,
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

bookSchema.methods.toJSON = function (): any {
	const userObject = this.toObject()
	userObject.id = userObject._id
	delete userObject['__v']
	return userObject
}

export default model<IBook>('Books', bookSchema)
