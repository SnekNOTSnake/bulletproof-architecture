import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	summary: {
		whiteSpace: 'break-spaces',
		marginBottom: theme.spacing(4),
		borderLeft: `4px solid ${theme.palette.primary.light}`,
		fontStyle: 'italic',
		paddingLeft: theme.spacing(2),
	},
	content: {
		whiteSpace: 'break-spaces',
		marginBottom: theme.spacing(4),
		textAlign: 'justify',
	},
	rating: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: theme.spacing(1),
	},
	stars: {
		marginRight: theme.spacing(1),
	},
	cardMedia: {
		height: 0,
		paddingBottom: '56.25%', // 16:9
	},
}))
