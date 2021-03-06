import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import initializePassport from './passport'
import path from 'path'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { NODE_ENV } from '../config'
import restRoutes from '../api/rest'
import { apolloServer } from '../api/graphql'

type Props = { app: express.Application }

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 Minutes
	max: 300, // limit each IP to 300 requests per `windowMs`
})
const whitelist = ['http://localhost:8080']

const loadExpress = async ({ app }: Props) => {
	app.use(cors({ origin: whitelist, credentials: true }))
	app.use(limiter)
	// Is there any way to enable the popup communication without using this?
	app.use(helmet())
	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				...helmet.contentSecurityPolicy.getDefaultDirectives(),
				'script-src': ["'self'", "'unsafe-inline'"],
			},
		}),
	)
	app.use(cookieParser())
	app.use(express.json())

	// Passport
	initializePassport(app)

	// REST API
	app.use('/api', restRoutes)

	// GraphQL API
	apolloServer(app)

	// Serve the static files when in production mode
	if (NODE_ENV === 'production') {
		app.use(express.static(path.resolve(__dirname, '../../public')))

		// Redirect all GET requests to `/`
		app.get('/*', (req, res, next) =>
			res.sendFile(path.join(__dirname, '../../public/index.html')),
		)
	}

	// Change default error page
	app.use((req, res, next) => {
		res.status(404).send(`
			<p>404 Not found</p>
		`)
	})

	// REST API global error handler
	const errHandler: express.ErrorRequestHandler = (err, req, res, next) => {
		if (NODE_ENV === 'production')
			return res.status(400).json({ message: err.message })

		res.status(400).json({
			message: err.message,
			stack: err.stack,
		})
	}
	app.use(errHandler)
}

export default loadExpress
