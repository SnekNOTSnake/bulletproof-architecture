import Joi from 'joi'

export default async function (joiSchema: Joi.Schema, value: any) {
	await joiSchema.validateAsync(value)
}
