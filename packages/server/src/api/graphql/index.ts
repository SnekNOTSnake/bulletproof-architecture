import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import { graphqlUploadExpress } from 'graphql-upload'

import context from '../../utils/context'
import { getSchema } from './schema'

export const apolloServer = (app: Application) => {
	app.use(graphqlUploadExpress({ maxFiles: 1, maxFileSize: 2000000 }))

	const server = new ApolloServer({
		/*
			Disable the built in file upload implementation that uses an outdated `graphql-upload` version. See: https://github.com/apollographql/apollo-server/issues/3508#issuecomment-662371289
		*/
		uploads: false,
		context,
		schema: getSchema(),
	})

	server.applyMiddleware({
		app,
		cors: false,
	})
}
