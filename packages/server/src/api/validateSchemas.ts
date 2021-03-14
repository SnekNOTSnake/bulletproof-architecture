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

export const updateMeSchema = Joi.object({
	name,
})

export const changePasswordSchema = Joi.object({
	password,
	newPassword: password,
})

// Book
const title = Joi.string().max(50).required()
const bookId = Joi.string().max(50).required()
const summary = Joi.string().max(200).required()
const content = Joi.string().min(100).max(2000).required()

export const createBookSchema = Joi.object({
	title,
	summary,
	content,
})

export const updateBookSchema = Joi.object({
	id: bookId,
	title,
})

export const deleteBookSchema = Joi.object({
	id: bookId,
})

export const getBooksSchema = Joi.object()
	.keys({
		first: Joi.number().min(1).max(100),
		after: Joi.string().max(50),
		last: Joi.number().min(1).max(100),
		before: Joi.string().max(50),
		search: Joi.string().max(50),
	})
	.xor('first', 'last')
	.oxor('after', 'before')
