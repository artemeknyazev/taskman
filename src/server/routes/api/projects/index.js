import { Router } from 'express'
import {
  getProjects,
} from 'server/models/projects'

// TODO: check response statuses
// TODO: api-specific error handlers
let router = Router()

router.get('/', (req, res) => {
  const { offset, limit } = req.query
  getProjects(
    {},
    [],
    parseInt(offset),
    parseInt(limit)
  ).then(({ count, collection }) => {
    res.status(200)
    res.set({ 'Content-Type': 'application/json' })
    res.json({
      result: { count, offset, limit, collection },
    })
  })
})

export default router