import React from 'react'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'

import AuthService from '../../services/Auth'
import useStyles from './EditPassword.style'

type FormSubmit = React.FormEvent<HTMLFormElement>
type InputChange = React.ChangeEvent<HTMLInputElement>
type Props = {
	setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const EditPassword: React.FC<Props> = ({ setCurrentUser }) => {
	const [password, setPassword] = React.useState<string>('')
	const [newPassword, setNewPassword] = React.useState<string>('')
	const [error, setError] = React.useState<string | null>(null)

	const history = useHistory()

	const onPasswordChange = (e: InputChange) =>
		setPassword(e.currentTarget.value)
	const onNewPasswordChange = (e: InputChange) =>
		setNewPassword(e.currentTarget.value)

	const onSubmit = async (e: FormSubmit) => {
		try {
			e.preventDefault()
			await AuthService.editPassword({ password, newPassword })
			setCurrentUser(null)
			history.push('/')
		} catch (err) {
			setError(err.response.data.message)
			setPassword('')
			setNewPassword('')
		}
	}

	const classes = useStyles()

	return (
		<form onSubmit={onSubmit}>
			<Box>
				{error ? (
					<Alert
						onClose={() => setError('')}
						severity="error"
						className={classes.alert}
					>
						{error}
					</Alert>
				) : (
					''
				)}
			</Box>
			<TextField
				fullWidth
				label="Password"
				variant="outlined"
				value={password}
				onChange={onPasswordChange}
				className={classes.input}
			/>
			<TextField
				fullWidth
				label="New password"
				variant="outlined"
				value={newPassword}
				onChange={onNewPasswordChange}
				className={classes.input}
			/>
			<Button
				color="primary"
				variant="contained"
				disableElevation
				type="submit"
			>
				Save
			</Button>
		</form>
	)
}

export default EditPassword
