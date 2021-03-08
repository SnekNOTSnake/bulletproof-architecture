class AppError extends Error {
	statusCode: number
	isOperational: boolean
	status: 'fail' | 'error'

	constructor(message: string, statusCode: number) {
		super(message)

		this.message = message
		this.statusCode = statusCode
		/** Is trusted error */
		this.isOperational = true
		this.status = String(statusCode).startsWith('4') ? 'fail' : 'error'

		// Excluding this class from stack trace
		Error.captureStackTrace(this, this.constructor)
	}
}

export default AppError
