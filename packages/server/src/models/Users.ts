import { Document, Schema, model } from 'mongoose'
import safeRegex from '../utils/safeRegex'

export interface IUser extends Document {
	id: string
	name: string
	email?: string
	joined: Date
	password?: string
	avatar: string
}

const userSchema = new Schema<IUser>({
	name: {
		type: String,
		required: [true, 'Name is required'],
		maxlength: 50,
	},
	email: {
		type: String,
		required: function (this: any) {
			return this.provider === 'email' ? true : false
		},
		validate: {
			validator: function (val: string) {
				return safeRegex(/^\w+@\w+\.\w+$/).test(val)
			},
			message: 'Invalid email',
		},
		maxlength: 50,
		unique: true,
		sparse: true,
	},
	password: {
		type: String,
	},
	joined: {
		type: Date,
		required: true,
		default: Date.now,
	},
	provider: {
		type: String,
		requried: true,
		default: 'email',
	},
	googleId: {
		type: String,
		unique: true,
		sparse: true,
	},
	gitHubId: {
		type: String,
		unique: true,
		sparse: true,
	},
	avatar: {
		type: String,
		required: true,
		default: 'default.jpg',
	},
})

userSchema.methods.toJSON = function (): any {
	const userObject = this.toObject()
	userObject.id = userObject._id
	delete userObject['__v']
	delete userObject['password']
	return userObject
}

export default model<IUser>('Users', userSchema)
