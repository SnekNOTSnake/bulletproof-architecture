import { QueryResolvers } from '../../generated/types'

export const me: QueryResolvers['me'] = (parent, args, { user }) => {
	return user
}
