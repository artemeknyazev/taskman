import {
  apiGet,
  apiPost,
  apiPatch,
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

export const getTasksByProjectId = (
  projectId,
  filter = {},
  offset = undefined,
  limit = undefined,
) =>
  apiGet(
    `/projects/${projectId}/tasks?` + prepareFilterQuery(filter, offset, limit),
  )

export const getTaskByIdAndProjectId = (
  id,
  projectId,
) =>
  apiGet(
    `/projects/${projectId}/tasks/${id}`,
  )

export const addTaskByProjectId = (
  projectId,
  data
) =>
  apiPost(
    `/projects/${projectId}/tasks`,
    { data }
  )

export const editTaskByIdAndProjectId = (
  id,
  projectId,
  data,
) =>
  apiPatch(
    `/projects/${projectId}/tasks/${id}`,
    { data }
  )

export const deleteTaskByIdAndProjectId = (
  id,
  projectId,
) =>
  apiDelete(
    `/projects/${projectId}/tasks/${id}`,
  )