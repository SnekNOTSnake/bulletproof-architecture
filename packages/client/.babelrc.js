const isDevelopment = !(process.env.NODE_ENV === 'production')
const plugins = [['@babel/plugin-proposal-class-properties']]
if (isDevelopment) plugins.push(['react-refresh/babel'])

module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					edge: 17,
					firefox: 60,
					chrome: 67,
					safari: '11.1',
				},
			},
		],
		'@babel/preset-react',
		'@babel/preset-typescript',
	],
	plugins: [
		...plugins,
		[
			'babel-plugin-import',
			{
				libraryName: '@material-ui/core',
				libraryDirectory: 'esm',
				camel2DashComponentName: false,
			},
			'core',
		],
		[
			'babel-plugin-import',
			{
				libraryName: '@material-ui/icons',
				libraryDirectory: 'esm',
				camel2DashComponentName: false,
			},
			'icons',
		],
	],
}
