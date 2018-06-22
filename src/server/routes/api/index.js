import { Router } from 'express'
import projects from './projects'

let router = Router()

// NOTE: cors options are route-specific because different
// routes accept different methods
router.use('/projects', projects)

router.get('/', (req, res) => {
  res.status(200)
  res.set({ 'Content-Type': 'application/json' })
  res.json({ message: 'Hello, World!' })
})

export default router