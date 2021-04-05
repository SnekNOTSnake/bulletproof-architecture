import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	root: {
		marginBottom: theme.spacing(2),
		display: 'flex',
		'& > a, & > button': {
			marginRight: theme.spacing(1),
		},
	},
	grow: {
		flexGrow: 1,
	},
	searchIcon: {
		marginRight: theme.spacing(0.5),
	},
	menu: {
		minWidth: 150,
	},
}))
