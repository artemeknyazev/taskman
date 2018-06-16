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

const randomFromArray = (array) =>
  array[ Math.floor(Math.random() * array.length) ]

const capitalize = (string) =>
  string.length
    ? string[0].toLocaleUpperCase() + string.slice(1)
    : string

const generate = (n) => {
  let result = []
  for (let i = 1; i <= n; ++i) {
    const now = new Date().getTime()
    const createdAt = Math.floor(now + (Math.random() - 1) * 100000)
    const updatedAt = Math.floor(createdAt + Math.random() * 100000)
    result.push({
      id: i,
      text: capitalize(randomFromArray(actions)) + ' ' + randomFromArray(objects),
      completed: Math.random() > 0.5,
      order: i,
      status: Math.random() < 0.95 ? 'active' : 'inactive',
      createdAt,
      updatedAt,
    })
  }
  return result
}

const N = parseInt(process.argv[1]) || 100
const dbData = {
  tasks: {
    maxId: N,
    collection: generate(N),
  }
}

const fs = require('fs')
const path = require('path')

const outputPath = path.resolve(__dirname, 'db.json')
process.stdout.write(`Started generating database\nOutput path is ${outputPath}\n`)
fs.writeFile(
  outputPath,
  JSON.stringify(dbData, null, 2),
  (err) => {
    if (err) process.stderr.write(`Can\'t write ${outputPath}: ${err}\n`)
    else     process.stdout.write('Finished\n')
  }
)