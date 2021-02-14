import Joi from 'joi'

const email = Joi.string().email().required()
const password = Joi.string()
	.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
	.required()

// Auth
export const signupSchema = Joi.object({
	name: Joi.string().min(3).max(50).required(),
	email,
	password,
})

export const signinSchema = Joi.object({
	email,
	password,
})

// Book
const title = Joi.string().max(50).required()
const bookId = Joi.string().required()

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
	first: Joi.number().min(1).required(),
	where: Joi.object({
		_id: Joi.string(),
	}),
	after: Joi.string(),
})
