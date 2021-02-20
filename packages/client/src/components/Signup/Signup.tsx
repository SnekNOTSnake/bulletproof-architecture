import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

const Signup: React.FC = () => {
	const [name, setName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const onNameChange = (e: InputChange) => setName(e.currentTarget.value)
	const onEmailChange = (e: InputChange) => setEmail(e.currentTarget.value)
	const onPasswordChange = (e: InputChange) =>
		setPassword(e.currentTarget.value)

	const [error, setError] = React.useState('')
	const [success, setSuccess] = React.useState('')

	const onSubmit = async (e: FormSubmit) => {
		try {
			e.preventDefault()

			const res = await axios.post('http://localhost:4200/api/auth/signup', {
				name,
				email,
				password,
			})

			if (res.data.user.id) {
				setSuccess(
					`Success registered with ID: ${res.data.user.id}. You can now log in with your new account`,
				)
				setError('')
			}
		} catch (err) {
			setError(err.response.data.message)
			setPassword('')
		}
	}

	return (
		<div className="Signup">
			<h2>Signup</h2>
			{error ? <div style={{ color: 'red' }}>{error}</div> : ''}
			{success ? <div>{success}</div> : ''}
			<form onSubmit={onSubmit}>
				<input
					type="text"
					name="name"
					value={name}
					onChange={onNameChange}
					placeholder="Name"
				/>
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
					value={password}
					onChange={onPasswordChange}
					placeholder="Password"
				/>
				<button type="submit">Submit</button>
			</form>
			<p>
				Already have an account? <Link to="/login">Login</Link>!
			</p>
		</div>
	)
}

export default Signup
