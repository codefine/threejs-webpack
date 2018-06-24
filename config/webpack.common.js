const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
	entry: {
		app: path.resolve(__dirname, '../src/app.js')
	},
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, '../dist')
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
							'syntax-dynamic-import', // import() support
							'transform-runtime' // async support
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
					fallback: 'style-loader'
				})
			},
			{
				test: /\.(png|svg|jpe*g|gif|obj|mtl|mp3|ogg)$/, // obj | mtl raw files etc...
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
			'threejs': path.resolve(__dirname, '../node_modules/three/examples/js'),
			'plugin': path.resolve(__dirname, '../src/plugins')
		}
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: path.resolve(__dirname, '../')
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/index.html'),
			favicon: path.resolve(__dirname, '../src/favicon.ico'),
		}),
		new ExtractTextPlugin({
			filename: '[name].bundle.css',
			disable: process.env.NODE_ENV === 'development'
		}),
		new Webpack.ProvidePlugin({ // preload three prototype
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