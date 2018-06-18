const fs = require('fs')
const path = require('path')
const generateTasks = require('./tasks')
const generateProjects = require('./projects')
const generateUsers = require('./users')

const outputPath = path.resolve(__dirname, '..', 'db.json')
process.stdout.write(`Started generating database\n`)
process.stdout.write(`Output path is ${outputPath}\n`)

const taskCount = 20
const projectCount = 5
const userCount = 10

Promise.all([
  generateTasks(taskCount, projectCount, userCount),
  generateProjects(projectCount),
  generateUsers(userCount),
]).then(([ tasks, projects, users ]) => {
  const dbData = {
    tasks: {
      maxId: tasks.length,
      collection: tasks,
    },
    projects: {
      maxId: projects.length,
      collection: projects,
    },
    users: {
      maxId: users.length,
      collection: users,
    },
  }

  fs.writeFile(
    outputPath,
    JSON.stringify(dbData, null, 2),
    (err) => {
      if (err) process.stderr.write(`Can\'t write ${outputPath}: ${err}\n`)
      else process.stdout.write('Finished\n')
    }
  )
})

