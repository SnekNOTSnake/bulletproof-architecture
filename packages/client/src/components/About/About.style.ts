import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	sourceRoot: {
		marginTop: theme.spacing(2),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing(3, 0),
	},
	source: {
		padding: theme.spacing(3),
		borderRadius: 100,
		color: 'inherit',
		transition: theme.transitions.create(['box-shadow', 'background-color'], {
			easing: 'ease-out',
			duration: 150,
		}),
		'&:hover': {
			boxShadow: theme.shadows['5'],
			backgroundColor: 'rgba(255, 255, 255, 0.05)',
		},
	},
	sourceIcon: {
		fontSize: '4em',
		display: 'block',
	},
}))
