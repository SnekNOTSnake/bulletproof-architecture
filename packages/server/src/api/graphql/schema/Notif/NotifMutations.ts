import { Container } from 'typedi'

import NotifService from '../../../../services/Notif'
import { MutationResolvers } from '../../generated/types'

export const readNotifs: MutationResolvers['readNotifs'] = async (
	parent,
	args,
	{ user },
) => {
	const notifServiceInstance = Container.get(NotifService)
	const result = await notifServiceInstance.readNotifs({
		userId: user.id,
	})

	return result
}

type Delete = MutationResolvers['deleteNotif']

export const deleteNotif: Delete = async (parent, { id }, { user }) => {
	const notifServiceInstance = Container.get(NotifService)
	const result = await notifServiceInstance.deleteNotif({
		userId: user.id,
		id,
	})

	return result
}
