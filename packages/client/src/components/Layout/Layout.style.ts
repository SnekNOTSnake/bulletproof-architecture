import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	'@global': {
		'*': {
			boxSizing: 'border-box',
		},
		body: {
			margin: 0,
			padding: 0,
			fontFamily: 'roboto, Arial, Helvetica, sans-serif',
		},
	},
	container: {
		paddingTop: theme.spacing(5),
		minHeight: '100vh',
		paddingBottom: theme.spacing(5),
	},
}))
