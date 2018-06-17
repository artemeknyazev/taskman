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
  let result = []
  for (let i = 1; i <= projectCount; ++i) {
    const now = new Date().getTime()
    const createdAt = Math.floor(now + (Math.random() - 1) * 100000)
    const updatedAt = Math.floor(createdAt + Math.random() * 100000)
    const name = capitalize(randomFromArray(prefix)) +
      (Math.random() > 0.5 ? randomFromArray(separator) +
        randomFromArray(suffix).toUpperCase() : '')
    result.push({
      id: i,
      name,
      slug: prepareSlug(name),
      status: Math.random() < 0.95 ? 'active' : 'inactive',
      createdAt,
      updatedAt,
    })
  }
  return result
}

module.exports = (...args) => Promise.resolve(generate(...args))