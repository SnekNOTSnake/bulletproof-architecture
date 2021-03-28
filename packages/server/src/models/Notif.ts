import { Document, Types, Schema, model } from 'mongoose'

export interface INotif extends Document {
	id: string
	userSender: object
	userTarget: object
	book?: object
	review?: object
	follow?: object
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
	book: {
		type: Types.ObjectId,
		ref: 'Book',
	},
	review: {
		type: Types.ObjectId,
		ref: 'Review',
	},
	follow: {
		type: Types.ObjectId,
		ref: 'Follow',
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

notifSchema.methods.toJSON = function (): any {
	const object = this.toObject()
	object.id = this._id
	delete object['__v']
	return object
}

export default model<INotif>('Notif', notifSchema)
