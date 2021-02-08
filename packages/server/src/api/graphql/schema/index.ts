import { makeExecutableSchema } from 'apollo-server-express'

import typeDefs from '../generated/typeDefs'
import resolvers from './resolvers'
import directives from './directives'

export const getSchema = () => {
	return makeExecutableSchema({
		typeDefs,
		resolvers: resolvers as any,
		schemaDirectives: directives,
	})
}
