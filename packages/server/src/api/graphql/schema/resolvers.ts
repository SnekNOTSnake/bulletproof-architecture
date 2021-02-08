import { AuthMutations, AuthQueries } from './Auth'
import { Book, BookQueries, BookMutations } from './Book'
import { Resolvers } from '../generated/types'
import scalars from './scalars'

const resolvers: Resolvers = {
	Book,
	Query: {
		...AuthQueries,
		...BookQueries,
	},
	Mutation: {
		...AuthMutations,
		...BookMutations,
	},
	...scalars,
}

export default resolvers
