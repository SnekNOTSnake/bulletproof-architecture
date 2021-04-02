import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import { graphqlUploadExpress } from 'graphql-upload'
import { Server } from 'http'

import { PORT } from '../../config'
import logger from '../../utils/logger'
import loaders, { ILoaders } from './dataloaders'
import { getSchema } from './schema'
import { dangerouslyDecodeToken, decodeToken } from '../../utils/token'
import { IUser } from '../../models/User'

const getUser = async (token: string) => {
	try {
		const decoded = await decodeToken(token)
		const user = await loaders.userByIds.load(decoded.userId)
		return user
	} catch (err) {
		return null
	}
}

// Context
export interface MyContext {
	user: IUser
	loaders: ILoaders
	getterId: string // Special ID ONLY for determining the `following` state
}

// Special User ID
const getGetterId = (token: string) => {
	try {
		const decoded = dangerouslyDecodeToken(token)
		return decoded.userId
	} catch (err) {
		return null
	}
}

export const apolloServer = (app: Application, server: Server) => {
	app.use(graphqlUploadExpress({ maxFiles: 1, maxFileSize: 2000000 }))

	const apolloServer = new ApolloServer({
		/*
			Disable the built in file upload implementation that uses an outdated `graphql-upload` version. See: https://github.com/apollographql/apollo-server/issues/3508#issuecomment-662371289
		*/
		uploads: false,
		subscriptions: {
			path: '/subscriptions',
			onConnect: async (connectionParams: any, websocket, context) => {
				const token = connectionParams.authorization?.split(' ')[1]
				const user = token ? await getUser(token) : null

				// Tell the world that user is online
				// Update to DB can be done in `getUserData` route

				// Add user to socket's context
				return { loaders, user }
			},
			onDisconnect: async (websocket, context) => {
				// Tell the world that user is offline, also update the DB
			},
		},
		context: async ({ req, connection }) => {
			// If request come from WebSocket subscription
			if (connection) return connection.context

			const token = req.headers['authorization']?.split(' ')[1] || null
			const user = token ? await getUser(token) : null
			const getterId = token ? getGetterId(token) : null

			return { user, loaders, getterId }
		},
		schema: getSchema(),
	})

	apolloServer.applyMiddleware({
		app,
		cors: false,
	})

	apolloServer.installSubscriptionHandlers(server)

	server.on('listening', () => {
		if (apolloServer.subscriptionsPath)
			logger.info(
				`🛰️  Subscriptions ws://localhost:${
					PORT + apolloServer.subscriptionsPath
				}`,
			)
	})
}
