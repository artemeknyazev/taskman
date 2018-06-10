const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'

module.exports = {
  name: 'client',
  mode: nodeEnv,
  devtool: 'inline-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        // extract styles into a separate file
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new CopyWebpackPlugin([ { from: path.resolve(__dirname, 'index.html') } ]),
  ],
  entry: path.resolve(__dirname, 'index.js'),
  resolve: {
    extensions: [ '.js', '.jsx' ],
    alias: {
      components: path.resolve(__dirname, 'components'),
      reducers: path.resolve(__dirname, 'reducers'),
      store: path.resolve(__dirname, 'store'),
      utils: path.resolve(__dirname, 'utils'),
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