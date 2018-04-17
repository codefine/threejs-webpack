const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common');
const Webpack = require('webpack');

module.exports = WebpackMerge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		open: true,
		https: false,
		contentBase: './dist',
		hot: true,
		host: '0.0.0.0', // local area network enabled
		port: 9527,
		useLocalIp: true,
		compress: true,
		headers: {},
		before(app) {}, /* eslint-disable-line */
		after(app) {}, /* eslint-disable-line */
	},
	plugins: [
		new Webpack.HotModuleReplacementPlugin()
	]
});