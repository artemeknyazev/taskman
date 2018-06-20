const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { DefinePlugin } = require('webpack')

const nodeEnv = process.env.NODE_ENV || 'development'
const isDevelopment = nodeEnv === 'development'
const isProduction = nodeEnv === 'production'

module.exports = {
  name: 'client',
  mode: nodeEnv,
  devtool: 'inline-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new DefinePlugin({
      IS_DEVELOPMENT: isDevelopment,
      IS_PRODUCTION: isProduction,
      IS_CLIENT: true,
      IS_SERVER: false,
    }),
  ],
  entry: path.resolve(__dirname, 'index.js'),
  resolve: {
    extensions: [ '.js', '.jsx' ],
    alias: {
      client: path.resolve(__dirname),
      utils: path.resolve(__dirname, '..', 'utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname),
      }, {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
        include: path.resolve(__dirname),
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 1000,
  }
}