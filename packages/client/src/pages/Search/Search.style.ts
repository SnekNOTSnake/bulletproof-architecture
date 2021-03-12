import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	search: {
		marginBottom: theme.spacing(4),
	},
	results: {
		'& $result:last-child': {
			marginBottom: 0,
		},
	},
	result: {
		marginBottom: theme.spacing(2),
	},
	more: {
		marginTop: theme.spacing(2),
	},
}))
