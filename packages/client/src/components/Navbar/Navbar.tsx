import React from 'react'
import { Link } from 'react-router-dom'
import Cookie from 'universal-cookie'

import Box from '@material-ui/core/Box'
import LinkComponent from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'

import useStyles from './Navbar.style'

const cookies = new Cookie()
const logout = () => {
	cookies.remove('jwt')
	window.location.href = '/'
}

type NavbarProps = { user?: ITokenPayload }
type LinkButtonProps = { to: string; text: string }

const LinkButton: React.FC<LinkButtonProps> = ({ to, text }) => (
	<LinkComponent underline="none" component={Link} to={to}>
		<Button color="inherit">{text}</Button>
	</LinkComponent>
)

const Navbar: React.FC<NavbarProps> = ({ user }) => {
	const classes = useStyles()

	const RenderLogin = user ? (
		<React.Fragment>
			<LinkButton to="/me" text={user.name} />
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
