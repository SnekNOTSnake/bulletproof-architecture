import { ErrorRequestHandler } from 'express'
import { Error as MongooseError } from 'mongoose'
import { MongoError } from 'mongodb'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ValidationError as JoiError } from 'joi'

import AppError from '../../../utils/AppError'
import { NODE_ENV } from '../../../config'

const handleCastErorr = (err: MongooseError.CastError) => {
	return new AppError(`Invalid ${err.path}: ${err.value}`, 400)
}

const handleDuplicateError = (err: MongoError) => {
	// Get the text inside quotes (errmsg came from MongoDB driver)
	const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)
	const message = value
		? `Duplicate name value: ${value[0]}`
		: 'Duplicate name value'

	return new AppError(message, 400)
}

const handleJoiValidation = (err: JoiError) => {
	const errors = err.details.map((error) => error.message)
	return new AppError(errors.join(', '), 400)
}

const handleMongooseValidation = (err: MongooseError.ValidationError) => {
	const errors = Object.values(err.errors).map((el) => el.message)
	return new AppError(errors.join(', '), 400)
}

const handleJwtError = (err: JsonWebTokenError) => {
	return new AppError('Invalid token, please get a new one', 400)
}

const handleExpiredError = (err: TokenExpiredError) => {
	return new AppError('Expired token, please get a new one', 401)
}

const sendErrorProd: ErrorRequestHandler = (error: AppError, req, res) => {
	// Whether the error is trusted or not
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		})
	} else {
		res.status(500).json({
			status: 'error',
			message: 'something went wrong',
		})
	}
}
const sendErrorDev: ErrorRequestHandler = (error: AppError, req, res) => {
	return res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
		error,
		stack: error.stack,
	})
}

const error: ErrorRequestHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'

	// MongoDB Duplciate Error
	if (err.code === 11000)
		return sendErrorProd(handleDuplicateError(err), req, res, next)

	let error: AppError = { ...err, message: err.message }

	switch (err.name) {
		case 'CastError':
			// Mongoose Cast Error (Invalid ID)
			error = handleCastErorr(err)
			break

		case 'ValidationError':
			if (err instanceof JoiError) {
				// Joi Validation Error
				error = handleJoiValidation(err)
			} else if (err instanceof MongooseError.ValidationError) {
				// Mongoose Validation Error
				error = handleMongooseValidation(err)
			}
			break

		case 'JsonWebTokenError':
		case 'VerifyErrors':
			// JWT Errors
			error = handleJwtError(err)
			break

		case 'TokenExpiredError':
			// JWT Expired Error
			error = handleExpiredError(err)
			break

		default:
			break
	}

	if (NODE_ENV === 'production') sendErrorProd(error, req, res, next)
	else sendErrorDev(error, req, res, next)
}

export default error
