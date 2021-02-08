import {
	SchemaDirectiveVisitor,
	AuthenticationError,
} from 'apollo-server-express'
import { defaultFieldResolver, GraphQLField } from 'graphql'

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field: GraphQLField<any, any>) {
		const { resolve = defaultFieldResolver } = field

		field.resolve = async function (...args) {
			const context = args[2]
			if (!context || !context.user)
				throw new AuthenticationError('You have to be logged in first')
			return resolve.apply(this, args)
		}
	}
}

export default {
	isAuthenticated: IsAuthenticatedDirective,
}
