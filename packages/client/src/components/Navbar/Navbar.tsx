import React from 'react'
import { useApolloClient } from '@apollo/client'
import { Link, useHistory } from 'react-router-dom'

import { Box, Badge, Link as LinkComponent, Button } from '@material-ui/core'
import {
	Search as SearchIcon,
	NightsStay as NightStayIcon,
	Brightness7 as WbSunnyIcon,
	Notifications as NotificationsIcon,
} from '@material-ui/icons'

import Notifications from '../Notifications'
import { useUserState, logoutUser, useUserDispatch } from '../../context/user'
import { useThemeDispatch, useThemeState } from '../../context/theme'
import useStyles from './Navbar.style'

type ClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>
type LinkButtonProps = { to: string; text: string }

const LinkButton: React.FC<LinkButtonProps> = ({ to, text }) => (
	<LinkComponent underline="none" component={Link} to={to}>
		<Button color="inherit">{text}</Button>
	</LinkComponent>
)

const Navbar: React.FC = () => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const close = () => setAnchorEl(null)
	const open = (e: ClickEvent) => {
		setAnchorEl(e.currentTarget)
	}

	const apolloClient = useApolloClient()
	const history = useHistory()

	const { theme } = useThemeState()
	const dispatchTheme = useThemeDispatch()
	const { data } = useUserState()
	const dispatchUser = useUserDispatch()

	const toggleTheme = () => dispatchTheme({ type: 'TOGGLE_THEME' })

	const logout = async () => {
		await logoutUser(dispatchUser)
		await apolloClient.clearStore()
		history.push('/')
	}

	const classes = useStyles()

	const renderUser = data ? (
		<React.Fragment>
			<LinkButton to={`/user/${data.user.id}`} text={data.user.name} />
			<LinkButton to="/create-book" text="Create Book" />
			<Button color="inherit" type="button" onClick={logout}>
				Logout
			</Button>
		</React.Fragment>
	) : (
		<React.Fragment>
			<LinkButton to="/login" text="Login" />
			<LinkButton to="/signup" text="Sign up" />
		</React.Fragment>
	)

	return (
		<Box className={classes.root}>
			{anchorEl && data ? (
				<Notifications anchorEl={anchorEl} onClose={close} />
			) : (
				''
			)}

			<LinkButton to="/" text="Home" />
			{renderUser}
			<Button color="inherit" type="button" onClick={toggleTheme}>
				{theme === 'light' ? <WbSunnyIcon /> : <NightStayIcon />}
			</Button>
			<Box className={classes.grow} />

			{data ? (
				<Button onClick={open}>
					<Badge badgeContent={data.newNotifs} color="secondary">
						<NotificationsIcon />
					</Badge>
				</Button>
			) : (
				''
			)}
			<LinkComponent underline="none" component={Link} to="/search">
				<Button type="button" color="inherit">
					<SearchIcon className={classes.searchIcon} />
					Search
				</Button>
			</LinkComponent>
		</Box>
	)
}

export default Navbar
