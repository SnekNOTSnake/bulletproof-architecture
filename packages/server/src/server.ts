process.on('uncaughtException', (err) => {
	console.error(err)
	process.exit()
})

import 'reflect-metadata' // We need this in order to use @Decorators
import express from 'express'
import logger from './utils/logger'
import { PORT } from './config'
import loaders from './loaders'

const startServer = async () => {
	const app = express()
	await loaders(app)

	const server = app
		.listen(PORT, () => logger.info(`Server available on port ${PORT}`))
		.on('error', (err) => logger.error(err.stack))

	process.on('unhandledRejection', (err: any) => {
		logger.error(err.stack)
		server.close(() => process.exit())
	})

	process.on('SIGTERM', () => {
		logger.info('SIGTERM RECEIVED, shutting down the app')
		// Serve all the requests before shutting down
		server.close(() => {
			logger.info('App terminated')
		})
	})
}

startServer()
