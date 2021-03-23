import { Auth, AuthMutations, AuthQueries } from './Auth'
import { Book, BookQueries, BookMutations } from './Book'
import { Review, ReviewQueries, ReviewMutations } from './Review'
import { Follow, FollowQueries, FollowMutations } from './Follow'
import { Resolvers } from '../generated/types'
import scalars from './scalars'

const resolvers: Resolvers = {
	User: Auth,
	Book,
	Review,
	Follow,
	Query: {
		...AuthQueries,
		...BookQueries,
		...ReviewQueries,
		...FollowQueries,
	},
	Mutation: {
		...AuthMutations,
		...BookMutations,
		...ReviewMutations,
		...FollowMutations,
	},
	...scalars,
}

export default resolvers
