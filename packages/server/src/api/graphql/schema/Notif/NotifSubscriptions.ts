import { withFilter } from 'apollo-server-express'

import { SubscriptionResolvers } from '../../generated/types'
import pubSub from '../../../../events/apollo'
import { NOTIF_CREATED } from '../../../../events/events'

export const notifCreated: SubscriptionResolvers['notifCreated'] = {
	subscribe: withFilter(
		() => pubSub.asyncIterator(NOTIF_CREATED),
		(payload, args, { user }: { user: IUser }) => {
			return user && String(payload.notifCreated.userTarget) === String(user.id)
		},
	),
}
