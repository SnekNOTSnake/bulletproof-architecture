import { Application } from 'express'
import { Server } from 'http'

import loadMongoose from './mongoose'
import loadExpress from './express'
import loadDI from './dependencyInjector'
import './events'

const loader = async (app: Application, server: Server) => {
	const mongoConnection = await loadMongoose()
	await loadExpress({ app, server })
	await loadDI({ mongoConnection })
}

export default loader
