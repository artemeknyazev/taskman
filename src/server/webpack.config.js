const path = require('path')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
    extensions: [ '.js', '.jsx', '.json' ],
    alias: {
      /* Server aliases */
      client: path.resolve(__dirname, '..', 'client'),
      models: path.resolve(__dirname, 'models'),
      routes: path.resolve(__dirname, 'routes'),
      /* Client aliases; required for SSR */
      components: path.resolve(__dirname, '..', 'client', 'components'),
      reducers: path.resolve(__dirname, '..', 'client', 'reducers'),
      store: path.resolve(__dirname, '..', 'client', 'store'),
      /* Utils alias */
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