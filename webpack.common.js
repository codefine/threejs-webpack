const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
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
			},
			{
				test: /\.(png|svg|jpe*g|gif|obj|mtl)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name() {
								return process.env.NODE_ENV === 'development' ? '[path][name].[ext]' : '[hash].[ext]';
							},
							outputPath: process.env.NODE_ENV === 'development' ? '' : 'sources/'
						}
					}
				]
			},
			{
				test: /\.html$/i,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: process.env.NODE_ENV !== 'development'
						}
					}
				]
			}
		]
	},
	resolve: {
		alias: {
			'threejs': path.join(__dirname, '/node_modules/three/examples/js')
		}
	},
	plugins: [
		new CleanWebpackPlugin(['dist']), // 打包时清空dist
		new HtmlWebpackPlugin({ // 打包时更新html引入文件路径
			template: 'src/index.html'
		}),
		new ExtractTextPlugin({ // css模块分离
			filename: '[name].bundle.css',
			disable: process.env.NODE_ENV === 'development'
		}),
		new Webpack.ProvidePlugin({ // 自动加载three模块，方便插件的继承
			THREE: 'three'
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
					name: 'commons',
					chunks: 'initial',
					minChunks: 2
				}
			}
		}
	}
};