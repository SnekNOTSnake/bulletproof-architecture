import { Container } from 'typedi'

import NotifService from '../../../../services/Notif'
import { QueryResolvers } from '../../generated/types'
import { connection } from '../../../../utils/graphql-connection'

export const notifs: QueryResolvers['notifs'] = connection({
	cursorFromNode: (node) => node.created.toISOString(),
	nodes: async (parent, { first, after, orderBy, where }, { user }) => {
		const [orderField, orderType]: any = orderBy.split('_')

		const notifServiceInstance = Container.get(NotifService)
		const notifs = await notifServiceInstance.getNotifs({
			userId: user.id,
			first,
			after,
			orderBy: orderField,
			orderType,
			where,
		})

		return notifs
	},
})
