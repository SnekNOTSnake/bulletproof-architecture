import express from 'express'

type asyncRequestHandler = ReplaceReturnType<
	express.RequestHandler,
	Promise<any>
>

export default function (func: asyncRequestHandler) {
	const requestHandler: express.RequestHandler = async (req, res, next) => {
		try {
			await func(req, res, next)
		} catch (err) {
			next(err)
		}
	}

	return requestHandler
}
