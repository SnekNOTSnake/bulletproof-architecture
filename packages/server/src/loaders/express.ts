import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import initializePassport from './passport'

import restRoutes from '../api/rest'
import { apolloServer } from '../api/graphql'

type Props = { app: express.Application }

const whitelist = ['http://localhost:8080']
const loadExpress = async ({ app }: Props) => {
	app.use(cors({ origin: whitelist, credentials: true }))
	app.use(cookieParser())
	app.use(express.json())

	// Passport
	initializePassport(app)

	// REST API
	app.use('/api', restRoutes)

	// GraphQL API
	apolloServer(app)

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
