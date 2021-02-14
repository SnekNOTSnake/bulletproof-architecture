import express from 'express'
import Joi from 'joi'

export default function (
	joiSchema: Joi.Schema,
	target: 'body' | 'query' = 'body',
) {
	const requestHandler: express.RequestHandler = async (req, res, next) => {
		try {
			switch (target) {
				case 'body':
					await joiSchema.validateAsync(req.body, { allowUnknown: true })
					break
				case 'query':
					await joiSchema.validateAsync(req.query, { allowUnknown: true })
					break
				default:
					break
			}

			next()
		} catch (err) {
			next(err)
		}
	}

	return requestHandler
}
