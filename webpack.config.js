const path = require('path')

const clientConfig = require('./src/client/webpack.config')
const serverConfig = require('./src/server/webpack.config')

clientConfig.output = {
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'public'),
}

serverConfig.output = {
  filename: 'server.js',
  path: path.resolve(__dirname),
}

module.exports = [
  clientConfig,
  serverConfig,
]