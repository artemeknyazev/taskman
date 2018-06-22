import { Router } from 'express'
import {
  getProjects,
  getProjectById,
} from 'server/models/projects'
import tasks from './tasks'

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

router.use('/:projectId/tasks', (req, res, next) => {
  const projectId = req.params.projectId
  getProjectById(projectId).then(
    (project) => {
      req.apiContext = { ...req.apiContext, project }
      next()
    },
    () => {
      res.status(404)
      res.set({ 'Content-Type': 'application/json' })
      res.json({
        error: `Project ${projectId} not found`,
      })
    }
  )
}, tasks)

export default router