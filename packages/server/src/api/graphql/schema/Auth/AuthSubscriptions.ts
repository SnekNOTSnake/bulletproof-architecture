import { withFilter } from 'apollo-server-express'

import { SubscriptionResolvers } from '../../generated/types'
import pubSub from '../../../../events/apollo'
import { IS_USER_ONLINE } from '../../../../events/events'

export const isUserOnline: SubscriptionResolvers['isUserOnline'] = {
	subscribe: withFilter(
		() => pubSub.asyncIterator(IS_USER_ONLINE),
		(payload, args, { user }) =>
			String(args.userId) === String(payload.isUserOnline.userId),
	),
}
