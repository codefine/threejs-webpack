const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = WebpackMerge(common, {
	mode: 'production',
	plugins: [
		new UglifyJSWebpackPlugin({
			uglifyOptions: {
				ie8: false,
				compress: true,
				mangle: true,
				warnings: false
			}
		})
	]
});