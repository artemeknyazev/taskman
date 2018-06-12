const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { DefinePlugin } = require('webpack')

const nodeEnv = process.env.NODE_ENV || 'development'
const isDevelopment = nodeEnv === 'development'
const isProduction = nodeEnv === 'production'

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
  plugins: [
    new DefinePlugin({
      IS_DEVELOPMENT: isDevelopment,
      IS_PRODUCTION: isProduction,
      IS_CLIENT: false,
      IS_SERVER: true,
    })
  ],
  resolve: {
    extensions: [ '.js', '.jsx', '.json' ],
    alias: {
      client: path.resolve(__dirname, '..', 'client'),
      server: path.resolve(__dirname),
      utils: path.resolve(__dirname, '..', 'utils'),
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname),
          path.resolve(__dirname, '..', 'client'),
        ],
      }, {
        test: /\.s?[ac]ss$/,
        loader: 'ignore-loader',
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 1000,
  }
}