import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'

import context from '../../utils/context'
import { getSchema } from './schema'

export const apolloServer = (app: Application) => {
	const server = new ApolloServer({
		context,
		schema: getSchema(),
	})

	server.applyMiddleware({ app })
}
