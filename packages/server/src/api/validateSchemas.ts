import Joi from 'joi'
import safeRegex from '../utils/safeRegex'

const name = Joi.string()
	.regex(safeRegex(/^[-_\d\w\s]*$/))
	.max(50)
	.required()
const email = Joi.string().max(50).email().required()
const password = Joi.string().min(8).max(100).required()

// Auth
export const signupSchema = Joi.object({
	name,
	email,
	password,
})

export const signinSchema = Joi.object({
	email,
	password,
})

// Book
const title = Joi.string().max(50).required()
const bookId = Joi.string().max(50).required()

export const createBookSchema = Joi.object({
	title,
})

export const updateBookSchema = Joi.object({
	id: bookId,
	title,
})

export const deleteBookSchema = Joi.object({
	id: bookId,
})

export const getBooksSchema = Joi.object({
	first: Joi.number().min(1).max(100).required(),
	where: Joi.object({
		_id: Joi.string().max(50),
	}),
	after: Joi.string().max(50),
})
