import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import LinkComponent from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'

import AuthService from '../../services/Auth'
import useStyles from './Navbar.style'

type NavbarProps = { currentUser: IUser | null; setCurrentUser: Function }
type LinkButtonProps = { to: string; text: string }

const LinkButton: React.FC<LinkButtonProps> = ({ to, text }) => (
	<LinkComponent underline="none" component={Link} to={to}>
		<Button color="inherit">{text}</Button>
	</LinkComponent>
)

const Navbar: React.FC<NavbarProps> = ({ currentUser, setCurrentUser }) => {
	const history = useHistory()

	const logout = async () => {
		await AuthService.logout()
		setCurrentUser(null)
		history.push('/')
	}

	const classes = useStyles()

	const RenderLogin = currentUser ? (
		<React.Fragment>
			<LinkButton to="/me" text={currentUser.name} />
			<LinkButton to="/create-book" text="Create Book" />
			<Button type="button" onClick={logout}>
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
			<LinkButton to="/" text="Home" />
			{RenderLogin}
		</Box>
	)
}

export default Navbar
