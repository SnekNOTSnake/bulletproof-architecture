import express from 'express'
import { notFound } from '../controllers/404'

const router = express.Router()

router.get('/', notFound)

export default router
