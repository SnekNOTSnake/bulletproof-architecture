import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import initializePassport from './passport'
import path from 'path'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Server } from 'http'

import globalErrorHandler from '../api/rest/controllers/error'
import { NODE_ENV } from '../config'
import restRoutes from '../api/rest'
import { apolloServer } from '../api/graphql/apolloServer'

const appRootDirectory = path.dirname(
	require.resolve('@bulletproof/client/package.json'),
)
const appBundleDirectory = path.join(appRootDirectory, 'dist')

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 Minutes
	max: 300, // limit each IP to 300 requests per `windowMs`
})
const whitelist = ['http://localhost:8080']

type Props = { app: express.Application; server: Server }
const loadExpress = async ({ app, server }: Props) => {
	app.use(cors({ origin: whitelist, credentials: true }))
	app.use(limiter)
	app.use(
		helmet({
			contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
		}),
	)
	app.use(cookieParser())
	app.use(express.json())

	// Passport
	initializePassport(app)

	// REST API
	app.use('/api', restRoutes)

	// GraphQL API
	apolloServer(app, server)

	// Statics
	app.use(express.static(path.resolve(__dirname, '../../public')))

	if (NODE_ENV === 'production') {
		app.use(express.static(appBundleDirectory))
		app.get('/*', (req, res, next) =>
			res.sendFile(path.join(appBundleDirectory, 'index.html')),
		)
	}

	// Change default error page
	app.use((req, res, next) => {
		res.status(404).send(`
			<p>404 Not found</p>
		`)
	})

	// REST API global error handler
	app.use(globalErrorHandler)
}

export default loadExpress
