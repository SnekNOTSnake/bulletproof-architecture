import { AuthMutations, AuthQueries } from './Auth'
import { Book, BookQueries, BookMutations } from './Book'
import { Review, ReviewQueries, ReviewMutations } from './Review'
import { Resolvers } from '../generated/types'
import scalars from './scalars'

const resolvers: Resolvers = {
	Book,
	Review,
	Query: {
		...AuthQueries,
		...BookQueries,
		...ReviewQueries,
	},
	Mutation: {
		...AuthMutations,
		...BookMutations,
		...ReviewMutations,
	},
	...scalars,
}

export default resolvers
