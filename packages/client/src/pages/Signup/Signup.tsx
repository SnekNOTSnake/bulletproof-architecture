import React from 'react'
import { Link } from 'react-router-dom'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import LinkComponent from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import useStyles from './Signup.style'
import AuthService from '../../services/Auth'

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

			const user = await AuthService.signup({
				name,
				email,
				password,
			})

			if (user.id) {
				setSuccess(
					`Success registered with ID: ${user.id}. You can now log in with your new account`,
				)
				setError('')
			}
		} catch (err) {
			setError(err.response.data.message)
			setPassword('')
		}
	}

	const classes = useStyles()

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card>
						<form onSubmit={onSubmit}>
							<CardHeader title="Sign up" />
							<CardContent>
								<Box className={classes.alert}>
									{error ? <Alert severity="error">{error}</Alert> : ''}
									{success ? <Alert>{success}</Alert> : ''}
								</Box>
								<TextField
									className={classes.input}
									fullWidth
									variant="outlined"
									label="Name"
									value={name}
									onChange={onNameChange}
								/>
								<TextField
									className={classes.input}
									fullWidth
									variant="outlined"
									label="Email"
									value={email}
									onChange={onEmailChange}
								/>
								<TextField
									className={classes.input}
									fullWidth
									variant="outlined"
									label="Password"
									type="password"
									value={password}
									onChange={onPasswordChange}
								/>
							</CardContent>
							<CardActions>
								<Button variant="contained" color="primary" type="submit">
									Submit
								</Button>
								<Typography>
									Already have an account?{' '}
									<LinkComponent component={Link} to="/login">
										Sign in
									</LinkComponent>
									!
								</Typography>
							</CardActions>
						</form>
					</Card>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Signup
