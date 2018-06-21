import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from './api-fetch'

const prepareFilterQuery = (
  filter = {},
  offset = undefined,
  limit = undefined,
) => {
  let result = ''
  if (filter instanceof Object) {
    if (filter.hasOwnProperty('q'))
      result += '&q=' + filter.q
    if (filter.hasOwnProperty('completed'))
      result += '&completed=' + filter.completed
  }
  if (offset !== undefined)
    result += '&offset=' + offset
  if (limit !== undefined)
    result += '&limit=' + limit
  return result
}

export const getTasks = (
  filter = {},
  offset = undefined,
  limit = undefined,
) =>
  apiGet(
    '/tasks?' + prepareFilterQuery(filter, offset, limit),
  )

export const getTaskById = (
  id
) =>
  apiGet(
    '/tasks/' + id,
  )

export const addTask = (
  data
) =>
  apiPost(
    '/tasks',
    { data }
  )

export const editTaskById = (
  id,
  data,
) =>
  apiPut(
    '/tasks/' + id,
    { data }
  )

export const deleteTaskById = (
  id
) =>
  apiDelete(
    '/tasks/' + id,
  )