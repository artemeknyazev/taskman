const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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