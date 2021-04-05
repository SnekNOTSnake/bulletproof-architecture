import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
	profile: {
		textAlign: 'center',
	},
	avatar: {
		position: 'relative',
	},
	avatarImage: {
		width: 200,
		height: 200,
		borderRadius: 200,
		margin: theme.spacing(2, 'auto'),
		display: 'block',
	},
	followIcon: {
		position: 'absolute',
		bottom: 8,
		right: 8,
	},
	name: {
		marginBottom: theme.spacing(1),
	},
	info: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	infoIcon: {
		fontSize: '1em',
		marginRight: theme.spacing(0.5),
	},
	divider: {
		width: 10,
	},
	menu: {
		marginTop: theme.spacing(2),
	},
	tabs: {
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
	},
	listItem: {
		whiteSpace: 'break-spaces',
		textAlign: 'justify',
	},
	online: {
		'& .MuiBadge-badge': {
			width: 13,
			height: 13,
			bottom: '17%',
			right: '17%',
			borderRadius: 10,
			backgroundColor: '#44b700',
			color: '#44b700',
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			'&::after': {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				borderRadius: '50%',
				animation: '$ripple 1.2s infinite ease-in-out',
				border: '1px solid currentColor',
				content: '""',
			},
		},
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0,
		},
	},
}))
