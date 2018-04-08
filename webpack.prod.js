const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = WebpackMerge(common, {
  plugins: [
    new UglifyJSWebpackPlugin({ // 压缩混淆
      uglifyOptions: {
        ie8: false, // 是否支持ie8
        compress: true, // 是否压缩
        mangle: true, // 是否混淆
        warnings: false // 是否警告提示
      }
    })
  ]
});