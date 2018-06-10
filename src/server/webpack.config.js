const path = require('path')
const nodeExternals = require('webpack-node-externals')

const nodeEnv = process.env.NODE_ENV || 'development'

module.exports = {
  name: 'server',
  mode: nodeEnv,
  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, 'index.js'),
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [ nodeExternals() ],
  resolve: {
    extensions: [ '.js', '.json' ],
    alias: {
      models: path.resolve(__dirname, 'models'),
      routes: path.resolve(__dirname, 'routes'),
      utils: path.resolve(__dirname, 'utils'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 1000,
  }
}