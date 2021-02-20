const { merge } = require('webpack-merge')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
	mode: 'development',
	devServer: {
		hot: true,
		historyApiFallback: true,
	},
	devtool: 'eval-source-map',
	module: {
		// Use `style-loader` for Dev.
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.module\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							// Also apply CSS Modules on `@import`-ed resources
							importLoaders: 1,
							// Enable CSS Modules
							modules: true,
						},
					},
				],
			},
		],
	},
	plugins: [new ReactRefreshPlugin({ overlay: { sockIntegration: 'wds' } })],
})
