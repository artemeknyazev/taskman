const { capitalize, randomFromArray } = require('./utils')

const prefix = [
  'shenzhen',
  'gaiden',
  'maxtel',
  'avalon',
  'garmarna',
  'karma',
  'silkstone',
]
const separator = [
  '_',
  '-',
  ' ',
  ':',
  ';',
]
const suffix = [
  'ai',
  'art',
  'az',
  'eax',
  'fx',
  'io',
  'xyz',
]

const prepareSlug = (name) =>
  name.toLowerCase().replace(/[ _\-:;]/g, '-')

const generate = (projectCount) => {
  const now = new Date().getTime()
  let result = []
  for (let i = 2; i <= projectCount; ++i) {
    const now = new Date().getTime()
    const createdAt = Math.floor(now + (Math.random() - 1) * 100000)
    const updatedAt = Math.floor(createdAt + Math.random() * 100000)
    const name = capitalize(randomFromArray(prefix)) +
      (Math.random() > 0.5 ? randomFromArray(separator) +
        randomFromArray(suffix).toUpperCase() : '')
    result.push({
      id: i.toString(),
      name,
      slug: prepareSlug(name),
      status: 'active',
      createdAt,
      updatedAt,
    })
  }
  result.push({
    id: (projectCount + 1).toString(),
    name: 'Empty project',
    slug: 'empty-project',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  })
  return result
}

module.exports = (...args) => Promise.resolve(generate(...args))