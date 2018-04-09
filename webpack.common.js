const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        enforce: 'pre', // preloader
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        }
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              'syntax-dynamic-import', // import()语法支持
              'transform-runtime' // async语法支持
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/i,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader' // 在开发环境使用 style-loader
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']), // 打包时清空dist
    new HtmlWebpackPlugin({ // 打包时更新html引入文件路径
      'title': 'myapp'
    }),
    new ExtractTextPlugin({ // css模块分离
      filename: "[name].bundle.css",
      disable: process.env.NODE_ENV === "development"
    })
  ],
  optimization: {
    namedChunks: true,
    splitChunks: {
      name: 'vendor',
      filename: 'vendor.bundle.js',
      chunks: 'all',
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        }
      }
    }
  }
}