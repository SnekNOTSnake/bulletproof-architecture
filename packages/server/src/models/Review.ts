import { Schema, Document, Types, model } from 'mongoose'

export interface IReview extends Document {
	id: string
	book: object
	author: object
	content: string
	rating: number
	created: Date
}

const reviewSchema: Schema<IReview> = new Schema<IReview>({
	book: {
		type: Types.ObjectId,
		ref: 'Book',
		required: true,
	},
	author: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	content: {
		type: String,
		minlength: 16,
		maxlength: 512,
		required: true,
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true,
	},
	created: {
		type: Date,
		required: true,
		default: Date.now,
	},
})

reviewSchema.index({ book: 1, author: 1 }, { unique: true })

reviewSchema.methods.toJSON = function (): any {
	const userObject = this.toObject()
	userObject.id = userObject._id
	delete userObject['__v']
	return userObject
}

export default model('Review', reviewSchema)
