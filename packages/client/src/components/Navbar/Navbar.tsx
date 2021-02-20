import React from 'react'
import { Link } from 'react-router-dom'
import Cookie from 'universal-cookie'

const cookies = new Cookie()
const logout = () => {
	cookies.remove('jwt')
	window.location.href = '/'
}

type Props = { user?: ITokenPayload }

const Navbar: React.FC<Props> = ({ user }) => {
	const RenderLogin = user ? (
		<React.Fragment>
			<Link to="/me">{user.name}</Link>
			<Link to="/create-book">Create Book</Link>
			<button type="button" onClick={logout}>
				Logout
			</button>
		</React.Fragment>
	) : (
		<React.Fragment>
			<Link to="/login">Login</Link>
			<Link to="/signup">Signup</Link>
		</React.Fragment>
	)

	return (
		<div className="Navbar">
			<Link to="/">Home</Link>
			{RenderLogin}
		</div>
	)
}

export default Navbar
