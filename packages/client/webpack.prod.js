const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	module: {
		// Use `mini-css-extract-plugin` for Prod
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.module\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							// Enable CSS Modules
							modules: true,
							// Also apply CSS Modules on `@import`-ed resources
							importLoaders: 1,
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new CssMinimizerPlugin(),
	],
})
