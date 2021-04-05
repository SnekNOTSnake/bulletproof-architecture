import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	paper: {
		width: 240,
	},
	drawerToolbar: {
		display: 'flex',
		justifyContent: 'flex-end',
		padding: theme.spacing(2, 0),
	},
	listLink: {
		color: 'inherit',
		textDecoration: 'none',
	},
}))
