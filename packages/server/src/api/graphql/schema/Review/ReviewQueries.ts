import { Container } from 'typedi'

import ReviewService from '../../../../services/Review'
import { QueryResolvers } from '../../generated/types'
import { connection } from '../../../../utils/graphql-connection'

export const review: QueryResolvers['review'] = async (parent, { id }) => {
	const reviewServiceInstance = Container.get(ReviewService)
	const result = await reviewServiceInstance.getReview(id)

	return result
}

export const reviews: QueryResolvers['reviews'] = connection({
	cursorFromNode: (node) => node.created.toISOString(),
	nodes: async (parent, { first, after, where, orderBy }, context, info) => {
		const [orderField, orderType]: any = orderBy.split('_')

		const reviewServiceInstance = Container.get(ReviewService)
		const reviews = await reviewServiceInstance.getReviews({
			first,
			after,
			where,
			orderBy: orderField,
			orderType,
		})

		return reviews
	},
})
