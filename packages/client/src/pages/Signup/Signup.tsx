import React from 'react'
import { Link } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import {
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Grid,
	Link as LinkComponent,
	TextField,
	Typography,
} from '@material-ui/core'

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

	const { enqueueSnackbar } = useSnackbar()

	const onSubmit = async (e: FormSubmit) => {
		try {
			e.preventDefault()

			const user = await AuthService.signup({
				name,
				email,
				password,
			})

			if (user.id) {
				enqueueSnackbar(
					`Success registered with ID: ${user.id}. You can now log in with your new account`,
					{ variant: 'success' },
				)
			}
		} catch (err) {
			if (err.response) {
				// Normal error (like validations, wrong password, etc.)
				enqueueSnackbar(err.response.data.message, { variant: 'error' })
			} else {
				// Network error
				enqueueSnackbar(err.message, { variant: 'error' })
			}
			setPassword('')
		}
	}

	const classes = useStyles()

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card variant="outlined">
						<form onSubmit={onSubmit}>
							<CardHeader title="Sign up" />
							<CardContent>
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
									fullWidth
									variant="outlined"
									label="Password"
									type="password"
									value={password}
									onChange={onPasswordChange}
								/>
							</CardContent>
							<CardActions>
								<Button
									disableElevation
									variant="contained"
									color="primary"
									type="submit"
								>
									Submit
								</Button>
								<Typography variant="body2">
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
