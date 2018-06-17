require('isomorphic-fetch')
const { capitalize } = require('./utils')

const generate = (userCount = 1) =>
  fetch(`https://randomuser.me/api?results=${userCount}&inc=name,email,login,picture&nat=us,dk,fr,gb&noinfo`)
  .then(res => res.json())
  .then(({ results }) =>
    results.map((data, index) => ({
      id: index,
      login: data.login.username,
      email: data.email,
      fullName: capitalize(data.name.first) + ' ' + capitalize(data.name.last),
      picture: data.picture,
      status: 'active',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }))
  )

module.exports = generate