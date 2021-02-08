import express from 'express'
import { info } from '../controllers/info'

const router = express.Router()

router.get('/', info)

export default router
