import Joi from 'joi'
import { safeRegex } from '../utils/helpers'

const requiredMongoID = Joi.string().max(50).required()
const mongoID = Joi.string().max(50)
const paginationLength = Joi.number().min(1).max(100)
const opaqueCursor = Joi.string().max(50)

// Auth
const name = Joi.string()
	.regex(safeRegex(/^[-_\d\w\s]*$/))
	.max(50)
	.required()
const email = Joi.string().max(50).email().required()
const password = Joi.string().min(8).max(100).required()

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
	bio: Joi.string().max(256).allow('').optional(),
	name,
})

export const changePasswordSchema = Joi.object({
	password,
	newPassword: password,
})

// Book
const title = Joi.string().max(50).required()
const summary = Joi.string().max(500).required()
const content = Joi.string().min(100).max(5000).required()

export const createBookSchema = Joi.object({
	title,
	summary,
	content,
})

export const updateBookSchema = Joi.object({
	id: requiredMongoID,
	title,
	summary,
	content,
})

export const deleteBookSchema = Joi.object({
	id: requiredMongoID,
})

export const getBooksSchema = Joi.object({
	first: paginationLength.required(),
	after: opaqueCursor,
	where: Joi.object({
		author: mongoID,
	}),
	orderBy: Joi.string().valid(
		'created_ASC',
		'created_DESC',
		'ratingsQuantity_ASC',
		'ratingsQuantity_DESC',
	),
	byFollowings: Joi.boolean(),
})

export const searchBooksSchema = Joi.object().keys({
	first: paginationLength,
	after: opaqueCursor,
	query: Joi.string().max(50),
})

// Review
const reviewContent = Joi.string().min(16).max(512).required()
const rating = Joi.number().min(1).max(5).required()

export const createReviewSchema = Joi.object({
	book: requiredMongoID,
	content: reviewContent,
	rating,
})

export const updateReviewSchema = Joi.object({
	id: requiredMongoID,
	content: reviewContent,
	rating,
})

export const deleteReviewSchema = Joi.object({
	id: requiredMongoID,
})

export const getReviewSchema = Joi.object({
	id: requiredMongoID,
})

export const getReviewsSchema = Joi.object({
	first: paginationLength.required(),
	after: opaqueCursor,
	where: Joi.object({
		book: mongoID,
		author: mongoID,
	}),
	orderBy: Joi.string().valid(
		'created_ASC',
		'created_DESC',
		'rating_ASC',
		'rating_DESC',
	),
})

// Follow
export const followUserSchema = Joi.object({
	following: requiredMongoID,
})

export const unfollowUserSchema = Joi.object({
	following: requiredMongoID,
})

export const getFollowsSchema = Joi.object({
	first: paginationLength.required(),
	after: opaqueCursor,
	where: Joi.object({
		follower: mongoID,
		following: mongoID,
	}),
	orderBy: Joi.string().valid('created_ASC', 'created_DESC'),
})
