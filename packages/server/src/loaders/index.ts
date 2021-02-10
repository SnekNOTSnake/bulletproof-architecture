import { Application } from 'express'
import loadMongoose from './mongoose'
import loadExpress from './express'
import loadDI from './dependencyInjector'
import './events'

const loader = async (app: Application) => {
	const mongoConnection = await loadMongoose()
	await loadExpress({ app })
	await loadDI({ mongoConnection })
}

export default loader
