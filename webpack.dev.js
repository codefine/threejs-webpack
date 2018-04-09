const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = WebpackMerge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // source-map 用于debug
  devServer: { // 本地测试服务器
    open: false,
    https: false,
    contentBase: './dist',
    port: 80,
    host: '0.0.0.0', // 局域网访问支持
    compress: true, // gzip压缩
    headers: {},
    before(app) {}, // 启动前hook
    after(app) {}, // 启动后hook
  }
});