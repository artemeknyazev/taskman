import { Router } from 'express'
import cors from 'cors'
import { httpOrigin } from 'server/common'
import {
  prepareFilter,
  getTasks,
  getTaskByIdAndProjectId,
  addTask,
  editTask,
  deleteTask,
} from 'server/models/tasks'

// TODO: check response statuses
// TODO: api-specific error handlers
let router = Router()

const corsOptionsRoot = {
  origin: httpOrigin,
  methods: 'GET,POST,OPTIONS',
}

router.options('/', cors(corsOptionsRoot))

router.get('/', cors(corsOptionsRoot), (req, res) => {
  const { offset, limit, ...filter } = req.query
  getTasks(
    prepareFilter({
      ...filter,
      projectId: req.apiContext.project.id,
    }),
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

router.post('/', cors(corsOptionsRoot), (req, res) => {
  const data = { ...req.body.data }
  data.projectId = req.apiContext.project.id
  addTask(data).then(
    result => {
      res.status(200)
      res.set({ 'Content-Type': 'application/json' })
      res.json({
        result: result,
      })
    },
    error => {
      res.status(422)
      res.set({ 'Content-Type': 'application/json' })
      res.json({
        error: error,
      })
    }
  )
})

const corsOptionsItem = {
  origin: httpOrigin,
  methods: 'GET,PATCH,DELETE,OPTIONS',
}

router.options('/:id', cors(corsOptionsItem))

router.get('/:id', cors(corsOptionsItem), (req, res) => {
  const id = req.params.id.toString()
  const projectId = req.apiContext.project.id
  getTaskByIdAndProjectId(id, projectId).then(
    result => {
      res.status(200)
      res.set({ 'Content-Type': 'application/json' })
      res.json({
        result: result,
      })
    },
    () => {
      res.status(404)
      res.set({ 'Content-Type': 'application/json' })
      res.json({
        error: "Task not found",
      })
    }
  )
})

router.patch('/:id', cors(corsOptionsItem), (req, res) => {
  const id = req.params.id.toString()
  const projectId = req.apiContext.project.id
  getTaskByIdAndProjectId(id, projectId).then(
    () => {
      editTask(id, req.body.data || {}).then(
        result => {
          res.status(200)
          res.set({ 'Content-Type': 'application/json' })
          res.json({
            result: result,
          })
        },
        error => {
          res.status(422)
          res.set({ 'Content-Type': 'application/json' })
          res.json({
            error: error,
          })
        }
      )
    },
    () => {
      res.status(404)
      res.set({ 'Content-Type': 'application/json' })
      res.json({
        error: `Task ${id} not found in project ${projectId}`,
      })
    }
  )
})

router.delete('/:id', cors(corsOptionsItem), (req, res) => {
  const id = req.params.id.toString()
  const projectId = req.apiContext.project.id
  getTaskByIdAndProjectId(id, projectId).then(
    () => {
      deleteTask(id).then(() => {
        res.status(200)
        res.json({
          result: true,
        })
      })
    },
    () => {
      res.status(404)
      res.set({ 'Content-Type': 'application/json' })
      res.json({
        error: `Task ${id} not found in project ${projectId}`,
      })
    }
  )
})

export default router