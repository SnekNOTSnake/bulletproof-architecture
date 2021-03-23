import { Document, Types, Schema, model } from 'mongoose'

export interface IFollow extends Document {
	id: string
	follower: object
	following: object
	created: Date
}

const followSchema: Schema<IFollow> = new Schema<IFollow>({
	follower: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	following: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	created: {
		type: Date,
		required: true,
		default: Date.now,
	},
})

followSchema.index({ follower: 1, following: 1 }, { unique: true })

followSchema.methods.toJSON = function (): any {
	const followObject = this.toObject()
	followObject.id = this._id
	delete followObject['__v']
	return followObject
}

export default model<IFollow>('Follow', followSchema)
