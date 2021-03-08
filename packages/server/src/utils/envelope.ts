import { Response } from 'express'

const envelope = (
	res: Response,
	data: object,
	options?: {
		status?: number
		message?: string
	},
) => {
	const defaults = { status: 200, message: 'success' }
	const opts = { ...defaults, ...options }

	res.status(opts.status).json({
		message: opts.message,
		data,
	})
}

export default envelope
