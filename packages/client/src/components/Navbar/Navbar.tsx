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
			<span>{user.name}</span>
			<button type="button" onClick={logout}>
				Logout
			</button>
		</React.Fragment>
	) : (
		<Link to="/login">Login</Link>
	)

	return (
		<div className="Navbar">
			<Link to="/">Home</Link>
			{RenderLogin}
		</div>
	)
}

export default Navbar
