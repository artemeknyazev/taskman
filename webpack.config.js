const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'

module.exports = {
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
    new CleanWebpackPlugin([ 'dist' ]),
    new CopyWebpackPlugin([ { from: path.resolve(__dirname, 'src/index.html') } ]),
  ],
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [ '.js', '.jsx' ],
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      store: path.resolve(__dirname, 'src/store'),
      utils: path.resolve(__dirname, 'src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
      }, {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
        include: path.resolve(__dirname, 'src'),
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 1000,
  }
}
