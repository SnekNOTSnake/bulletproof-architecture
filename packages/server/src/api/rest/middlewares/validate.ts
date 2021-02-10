import express from 'express'
import Joi from 'joi'

export default function (joiSchema: Joi.Schema) {
	const requestHandler: express.RequestHandler = async (req, res, next) => {
		try {
			await joiSchema.validateAsync(req.body)

			next()
		} catch (err) {
			next(err)
		}
	}

	return requestHandler
}
