process.on('uncaughtException', (err) => {
	console.error(err)
	process.exit()
})

import 'reflect-metadata' // We need this in order to use @Decorators
import express from 'express'
import http from 'http'

import logger from './utils/logger'
import { PORT } from './config'
import loaders from './loaders'

const startServer = async () => {
	const app = express()
	const server = http.createServer(app)
	await loaders(app, server)

	server
		.listen(PORT, () => logger.info(`🚀 Server http://localhost:${PORT}`))
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
