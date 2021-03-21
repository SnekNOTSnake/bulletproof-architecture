import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	results: {
		'& $result:last-child': {
			marginBottom: 0,
		},
		'& $result:first-child': {
			marginTop: theme.spacing(2),
		},
	},
	result: {
		marginBottom: theme.spacing(2),
	},
	more: {
		marginTop: theme.spacing(2),
	},
}))
