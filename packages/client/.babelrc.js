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
	plugins,
}
