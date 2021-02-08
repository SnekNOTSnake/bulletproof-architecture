import { Document, Schema, model } from 'mongoose'

export interface IUser {
	name: string
	email: string
	joined: Date
	password: string
}

export interface DocumentUser extends IUser, Document {}

const usersSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		maxlength: 25,
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		validate: {
			validator: function (val: string) {
				return /^\w+@\w+\.\w+$/.test(val)
			},
			message: 'Invalid email',
		},
		maxlength: 25,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
	},
	joined: {
		type: Date,
		required: true,
		default: Date.now(),
	},
})

export default model<DocumentUser>('Users', usersSchema)
