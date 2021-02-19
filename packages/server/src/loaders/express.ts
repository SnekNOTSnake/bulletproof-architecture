import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import initializePassport from './passport'
import path from 'path'

import restRoutes from '../api/rest'
import { apolloServer } from '../api/graphql'

type Props = { app: express.Application }

const whitelist = ['http://localhost:8080']
const loadExpress = async ({ app }: Props) => {
	app.use(cors({ origin: whitelist, credentials: true }))
	app.use(cookieParser())
	app.use(express.json())
	app.use(express.static(path.resolve(__dirname, '../../public')))

	// Passport
	initializePassport(app)

	// REST API
	app.use('/api', restRoutes)

	// GraphQL API
	apolloServer(app)

	// Redirect all GET requests to `/`
	app.get('/*', (req, res, next) =>
		res.sendFile(path.join(__dirname, '../../public/index.html')),
	)

	// REST API global error handler
	const errHandler: express.ErrorRequestHandler = (err, req, res, next) => {
		res.status(400).json({
			message: err.message,
			stack: err.stack,
		})
	}
	app.use(errHandler)
}

export default loadExpress
