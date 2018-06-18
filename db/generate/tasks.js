const { capitalize, randomFromArray } = require('./utils')

const actions = [
  'clean',
  'open',
  'close',
  'refactor',
  'implement',
  'write',
  'fix',
  'update',
  'add',
]
const objects = [
  'kitchen',
  'bathroom',
  'living room',
  'book',
  'application',
  'letter',
  'essay',
  'library',
  'code',
  'laptop',
]

const generate = (taskCount, projectCount, userCount) => {
  let result = []
  for (let i = 1; i <= taskCount; ++i) {
    const now = new Date().getTime()
    const createdAt = Math.floor(now + (Math.random() - 1) * 100000)
    const updatedAt = Math.floor(createdAt + Math.random() * 100000)
    result.push({
      id: i,
      text: capitalize(randomFromArray(actions)) + ' ' + randomFromArray(objects),
      completed: Math.random() > 0.5,
      order: i,
      projectId: Math.ceil(Math.random() * projectCount),
      userId: Math.ceil(Math.random() * userCount),
      //status: Math.random() < 0.95 ? 'active' : 'inactive',
      status: 'active',
      createdAt,
      updatedAt,
    })
  }
  return result
}

module.exports = (...args) => Promise.resolve(generate(...args))