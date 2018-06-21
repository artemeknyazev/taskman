import db from './db'

const prepareFilterPred = ({
  id,
  slug,
}) => (item) => {
  let result = item.status === 'active'
  if (id !== undefined)
    result = result && item.id === id
  if (slug !== undefined)
    result = result && item.slug === slug
  return result
}

export const getProjects = (
  filter = {},
  sort = [],
  offset = undefined,
  limit = undefined
) => new Promise(resolve => {
  let collection = db.get('projects.collection')
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

export const getProject = (
  filter
) => new Promise((resolve, reject) => {
  const collection = db.get('projects.collection')
    .filter(prepareFilterPred(filter))
    .value()
  if (collection.length)
    resolve(collection[0])
  else
    reject()
})

export const getProjectById = (
  id
) =>
  getProject({ id })

export const getProjectBySlug = (
  slug
) =>
  getProject({ slug })