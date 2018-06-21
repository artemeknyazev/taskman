import db from './db'

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

export const getProject = (
  id
) => new Promise((resolve, reject) => {
  const collection = db.get('projects.collection')
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