import express from 'express'

export const notFound: express.RequestHandler = (req, res, next) => {
	res.status(404).json({
		message: 'API endpoint not found',
	})
}
