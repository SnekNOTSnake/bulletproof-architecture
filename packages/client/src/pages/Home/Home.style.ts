import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	cardGrid: {
		marginBottom: theme.spacing(2),
	},
	subtitle: {
		fontSize: 14,
	},
	summary: {
		whiteSpace: 'break-spaces',
		marginBottom: theme.spacing(2),
	},
	rating: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: theme.spacing(1),
	},
	stars: {
		marginRight: theme.spacing(1),
	},
	moreButton: {
		marginRight: theme.spacing(1),
	},
	formControl: {
		marginBottom: theme.spacing(2),
		minWidth: 180,
	},
	noBook: {
		marginBottom: theme.spacing(2),
	},
	cardMedia: {
		height: 0,
		paddingBottom: '50%', // 2:1
	},
}))
