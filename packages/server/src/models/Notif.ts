import { Document, Types, Schema, model } from 'mongoose'

export interface INotif extends Document {
	id: string
	userSender: object
	userTarget: object
	type: 'REVIEW' | 'NEW_BOOK' | 'FOLLOW'
	book?: object
	review?: object
	created: Date
	read: boolean
}

const notifSchema = new Schema<INotif>({
	userSender: {
		type: Types.ObjectId,
		required: true,
		ref: 'User',
	},
	userTarget: {
		type: Types.ObjectId,
		required: true,
		ref: 'User',
	},
	type: {
		type: String,
		enum: ['REVIEW', 'NEW_BOOK', 'FOLLOW'],
		required: true,
	},
	book: {
		type: Types.ObjectId,
		ref: 'Book',
	},
	review: {
		type: Types.ObjectId,
		ref: 'Review',
	},
	read: {
		type: Boolean,
		required: true,
		default: false,
	},
	created: {
		type: Date,
		required: true,
		default: Date.now,
	},
})

notifSchema.index({ userSender: 1, userTarget: 1 })

notifSchema.methods.toJSON = function (): any {
	const object = this.toObject()
	object.id = this._id
	delete object['__v']
	return object
}

export default model<INotif>('Notif', notifSchema)
