import { Auth, AuthMutations, AuthQueries, AuthSubscriptions } from './Auth'
import { Book, BookQueries, BookMutations } from './Book'
import { Review, ReviewQueries, ReviewMutations } from './Review'
import { Follow, FollowQueries, FollowMutations } from './Follow'
import {
	Notif,
	NotifQueries,
	NotifMutations,
	NotifSubscriptions,
} from './Notif'

import { Resolvers } from '../generated/types'
import scalars from './scalars'

const resolvers: Resolvers = {
	User: Auth,
	Book,
	Review,
	Follow,
	Notif,
	Query: {
		...AuthQueries,
		...BookQueries,
		...ReviewQueries,
		...FollowQueries,
		...NotifQueries,
	},
	Mutation: {
		...AuthMutations,
		...BookMutations,
		...ReviewMutations,
		...FollowMutations,
		...NotifMutations,
	},
	Subscription: {
		...NotifSubscriptions,
		...AuthSubscriptions,
	},
	...scalars,
}

export default resolvers
