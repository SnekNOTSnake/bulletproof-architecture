import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(3),
	},
	alert: {
		marginBottom: theme.spacing(2),
	},
	input: {
		marginBottom: theme.spacing(2),
	},
	preview: {
		paddingBottom: '100%',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		border: 'none',
	},
}))
