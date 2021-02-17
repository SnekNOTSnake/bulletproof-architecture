const { merge } = require('webpack-merge')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
	mode: 'development',
	devServer: {
		hot: true,
	},
	devtool: 'eval-source-map',
	plugins: [new ReactRefreshPlugin({ overlay: { sockIntegration: 'wds' } })],
})
