import express from 'express'

export const info: express.RequestHandler = (req, res, next) => {
	res.status(200).json({
		message:
			'Bulletproof Backend Architecture! Supports both RESTful API and GraphQL API!',
	})
}
