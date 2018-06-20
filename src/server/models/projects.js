import db from './db.js'

export const getProjects = (
  filter = {},
  sort = [],
  offset = undefined,
  limit = undefined
) => new Promise(resolve => {
  let collection = db.get('projects.collection')
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