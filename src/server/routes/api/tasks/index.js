import { Router } from 'express'
import {
  prepareFilter,
  getTasks,
  getTask,
  addTask,
  editTask,
  deleteTask,
} from 'server/models/tasks'

// TODO: check response statuses
// TODO: api-specific error handlers
let router = Router()

router.get('/', (req, res) => {
  const { offset, limit, ...filter } = req.query
  getTasks(
    prepareFilter(filter),
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

router.post('/', (req, res) => {
  addTask(req.body.data || {}).then(
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

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  getTask(id).then(
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

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  getTask(id).then(
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
        error: "Task not found",
      })
    }
  )
})

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  getTask(id).then(
    () => {
      deleteTask(id).then(() => {
        res.status(200)
        res.send({
          result: true,
        })
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

export default router