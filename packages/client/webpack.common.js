const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const fileExtensions = [
	'jpg',
	'png',
	'gif',
	'svg',
	'woff',
	'woff2',
	'eot',
	'ttf',
	'otf',
]

/** @type import('webpack').Configuration */
module.exports = {
	performance: {
		maxAssetSize: 768000,
		maxEntrypointSize: 768000,
	},
	entry: './src/index.tsx',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.(js|ts)x?$/,
				loader: 'babel-loader',
				options: { generatorOpts: { compact: false } },
			},
			{
				test: new RegExp(`.(${fileExtensions.join('|')})$`),
				use: ['file-loader'],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({ template: './public/index.html', minify: true }),
	],
}
