import { Container } from 'typedi'

import ReviewService from '../../../../services/Review'
import { MutationResolvers } from '../../generated/types'

export const createReview: MutationResolvers['createReview'] = async (
	parent,
	{ book, content, rating },
	{ user },
) => {
	const reviewServiceInstance = Container.get(ReviewService)
	const result = await reviewServiceInstance.createReview({
		book,
		author: user.id,
		content,
		rating,
	})

	return result
}

export const updateReview: MutationResolvers['updateReview'] = async (
	parent,
	{ id, content, rating },
	{ user },
) => {
	const reviewServiceInstance = Container.get(ReviewService)
	const result = await reviewServiceInstance.updateReview({
		id,
		userId: user.id,
		content,
		rating,
	})

	return result
}

export const deleteReview: MutationResolvers['deleteReview'] = async (
	parent,
	{ id },
	{ user },
) => {
	const reviewServiceInstance = Container.get(ReviewService)
	const result = await reviewServiceInstance.deleteReview({
		id,
		userId: user.id,
	})

	return result
}
