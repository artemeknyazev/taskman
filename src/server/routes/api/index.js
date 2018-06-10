import { Router } from 'express'
import tasks from './tasks'

let router = Router()

router.use('/tasks', tasks)

router.get('/', (req, res) => {
  res.status(200)
  res.set({ 'Content-Type': 'application/json' })
  res.json({ message: 'Hello, World!' })
})

export default router