import React from 'react'
import axios from 'axios'
import Cookie from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookie = new Cookie()
const login = (token: string) => {
	cookie.set('jwt', token)
	window.location.href = '/'
}

type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

const Login: React.FC = () => {
	const [email, setEmail] = React.useState<string>('')
	const [pass, setPass] = React.useState<string>('')
	const [error, setError] = React.useState<string | undefined>()

	const onEmailChange = (e: InputChange) => setEmail(e.currentTarget.value)
	const onPassChange = (e: InputChange) => setPass(e.currentTarget.value)

	const onSubmit = async (e: FormSubmit) => {
		try {
			e.preventDefault()

			const res = await axios.post('http://localhost:4200/api/auth/signin', {
				email,
				password: pass,
			})

			return login(res.data.authData.token)
		} catch (err) {
			setError(err.response.data.message)
			setPass('')
		}
	}

	return (
		<div className="Login">
			<h2>Login</h2>
			<div>
				<h3>Login using</h3>
				<a href="http://localhost:4200/api/auth/google">
					<button type="button">Google</button>
				</a>
				<a href="http://localhost:4200/api/auth/github">
					<button type="button">GitHub</button>
				</a>
			</div>
			<div>
				<form onSubmit={onSubmit}>
					{error ? <div style={{ color: 'red' }}>{error}</div> : ''}
					<input
						type="text"
						name="email"
						value={email}
						onChange={onEmailChange}
						placeholder="Email"
					/>
					<input
						type="password"
						name="password"
						value={pass}
						onChange={onPassChange}
						placeholder="Password"
					/>
					<button type="submit">Submit</button>
				</form>
				<p>
					Don't have an account? <Link to="/signup">Signup</Link>!
				</p>
			</div>
		</div>
	)
}

export default Login
