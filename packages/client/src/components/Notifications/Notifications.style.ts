import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	popover: {
		maxWidth: 500,
		minWidth: 300,
		padding: theme.spacing(3, 2),
	},
	divider: {
		margin: theme.spacing(2, 0),
	},
	moreButton: {
		marginTop: theme.spacing(2),
	},
}))
