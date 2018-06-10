import { Router } from 'express'
import api from './api'

let router = Router()
router.use('/api', api)

export default router