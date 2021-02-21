import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	root: {
		marginBottom: theme.spacing(2),
		'& > a, & > button': {
			marginRight: theme.spacing(1),
		},
	},
}))
