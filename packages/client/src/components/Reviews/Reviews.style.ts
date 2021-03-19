import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(3),
	},
	reviews: {
		'& .MuiPaper-root:last-child': {
			marginBottom: 0,
		},
	},
	addReviewButton: {
		marginBottom: theme.spacing(3),
		display: 'block',
	},
}))
