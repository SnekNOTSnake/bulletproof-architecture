import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(3),
		'& button': {
			marginRight: theme.spacing(1),
		},
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
	generals: {
		marginBottom: theme.spacing(6),
	},
	generalsContent: {
		marginBottom: theme.spacing(1),
	},
}))
