import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	person: {
		textAlign: 'center',
		padding: theme.spacing(3),
	},
	personAvatar: {
		borderRadius: 200,
		display: 'block',
		margin: theme.spacing(0, 'auto', 2),
		width: 120,
	},
	link: {
		'&:hover': {
			textDecoration: 'none',
		},
	},
}))
