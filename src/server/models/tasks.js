import validate from 'validate.js'
import { sanitize } from 'sanitizer'
import { parseBoolean } from 'utils'
import db from './db.js'

const textConstraint = {
  length: { minimum: 1, message: 'message can\'t be empty' }
}
const completedConstraint = {
  inclusion: [ "true", "false", "1", "0", 1, 0, true, false ]
}

const addConstraint = {
  text: { ...textConstraint, presence: true },
  completed: { ...completedConstraint, presence: true },
  order: { presence: true },
}
const editConstraint = {
  text: { ...textConstraint },
  completed: { ...completedConstraint },
}

export const prepareFilter = ({
  q,
  completed,
}) => {
  let filter = {}
  if (q !== undefined) {
    const match = q.match(/^#(\d+)$/)
    if (match)
      filter.id = parseInt(match[1].trim())
    else
      filter.text = sanitize(q.trim())
  }
  if (completed !== undefined)
    filter.completed = parseBoolean(completed)
  return filter
}

export const prepareFilterPred = ({
  id,
  text,
  completed,
}) => (item) => {
  let result = item.status === 'active'
  if (id !== undefined)
    result = result && item.id === id
  if (text !== undefined)
    result = result && item.text.includes(text)
  if (completed !== undefined)
    result = result && item.completed === completed
  return result
}

const prepareBeforeValidate = (data) =>
  Object.keys(data).reduce((acc, key) => {
    if (typeof data[key] === 'string')
      acc[key] = data[key].trim()
    else
      acc[key] = data[key]
    return acc
  }, {})

const prepareForAdd = (
  data
) => {
  const now = new Date().getTime()
  let result = {
    text: sanitize(data.text.trim()),
    completed: parseBoolean(data.completed),
    order: parseFloat(data.order),
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }
  return result
}

const prepareForEdit = (
  data
) => {
  const now = new Date().getTime()
  let result = { updatedAt: now }
  if (data.hasOwnProperty('text'))
    result.text = sanitize(data.text.trim())
  if (data.hasOwnProperty('completed'))
    result.completed = parseBoolean(data.completed)
  if (data.hasOwnProperty('order'))
    result.order = parseFloat(data.order)
  return result
}

export const getTasks = (
  filter = {},
  sort = [],
  offset = undefined,
  limit = undefined
) => new Promise(resolve => {
  let collection = db.get('tasks.collection')
    .filter(prepareFilterPred(filter))
    .sortBy(sort)
    .value()
  offset = offset || 0
  limit = limit || collection.length
  resolve({
    count: collection.length,
    offset,
    limit,
    collection: collection.slice(offset, offset + limit)
  })
})

export const getTask = (
  id
) => new Promise((resolve, reject) => {
  const collection = db.get('tasks.collection')
    .filter({
      id,
      status: 'active',
    })
    .value()
  if (collection.length)
    resolve(collection[0])
  else
    reject()
})

export const addTask = (
  data
) => new Promise((resolve, reject) => {
  validate.async(
    prepareBeforeValidate(data),
    addConstraint
  ).then(
    data => {
      const id = db.get('tasks.maxId').value() + 1
      db.set('tasks.maxId', id).write()
      data = prepareForAdd(data)
      data.id = id
      const collection = db.get('tasks.collection')
        .push(data)
        .write()
      resolve(collection.slice(-1)[0])
    },
    reject
  )
})

export const editTask = (
  id,
  data
) => new Promise((resolve, reject) => {
  validate.async(
    prepareBeforeValidate(data),
    editConstraint
  ).then(
    () => {
      data = prepareForEdit(data)
      const collection = db.get('tasks.collection')
        .find({
          id,
          status: 'active',
        })
        .assign(data)
        .write()
      resolve(collection)
    },
    reject
  )
})

export const deleteTask = (
  id
) => new Promise(resolve => {
  const collection = db.get('tasks.collection')
    .find({
      id,
      status: 'active',
    })
    .assign({
      status: 'inactive'
    })
    .write()
  resolve()
})