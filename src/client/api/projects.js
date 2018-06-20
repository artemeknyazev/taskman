import {
  apiGet,
} from './api-fetch'

export const getProjects = () =>
  apiGet(
    '/projects'
  )