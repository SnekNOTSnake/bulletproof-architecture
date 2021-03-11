import React from 'react'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { useUpdateMeMutation } from '../../generated/types'
import useStyles from './EditProfile.style'

type FormSubmit = React.FormEvent<HTMLFormElement>
type FileChange = React.ChangeEvent<HTMLInputElement>
type InputChange = React.ChangeEvent<HTMLInputElement>
type Props = {
	user: IUser
	setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const EditProfile: React.FC<Props> = ({ user, setCurrentUser }) => {
	const [name, setName] = React.useState<string>(user.name)
	const [file, setFile] = React.useState<File | null>(null)
	const [progress, setProgress] = React.useState<number>(0)
	const [preview, setPreview] = React.useState<string>('')

	const fileInput = React.useRef<HTMLInputElement>(null)

	const reset = () => {
		setName(user.name)
		setPreview('')
		setFile(null)
		setProgress(0)

		if (fileInput.current) fileInput.current.value = ''
	}

	const [mutate, { loading, data, error }] = useUpdateMeMutation({
		onCompleted: (result) => {
			setCurrentUser((initVal) => {
				if (!initVal) return null
				return {
					...initVal,
					name: result.updateMe.name,
					avatar: result.updateMe.avatar,
				}
			})

			reset()
		},
		onError: () => {},
	})

	const onSubmit = (e: FormSubmit) => {
		e.preventDefault()
		if (!name || loading) return

		let abort: any

		mutate({
			variables: { file, name },
			context: {
				fetchOptions: {
					useUpload: true,
					onProgress: (ev: ProgressEvent) => {
						setProgress((ev.loaded / ev.total) * 100)
					},
					onAbortPossible: (abortHandler: any) => {
						abort = abortHandler
					},
				},
			},
		})

		return () => {
			if (!abort) return
			abort()
		}
	}

	const onNameChange = (e: InputChange) => setName(e.currentTarget.value)
	const onFileChange = async ({ currentTarget: { files } }: FileChange) => {
		if (!files?.length) return

		const file = files[0]
		const reader = new FileReader()

		const result = await new Promise<any>((resolve, reject) => {
			reader.readAsDataURL(new Blob([file]))
			reader.onload = () => resolve(reader.result)
			reader.onerror = () => reject(reader.error)
		})

		setPreview(result)
		setFile(file)
	}

	const classes = useStyles()
	const avatar = `http://localhost:4200/img/${user.avatar}`

	return (
		<Box className={classes.root}>
			<Card>
				<form onSubmit={onSubmit}>
					<CardHeader title="Edit Profile" />
					<CardContent>
						<Grid container spacing={2}>
							<Grid item xs={3}>
								<Card
									style={{
										backgroundImage: `url(${preview ? preview : avatar})`,
									}}
									className={classes.preview}
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={9}>
								<Box>
									{error ? (
										<Alert className={classes.alert} severity="error">
											{error.message}
										</Alert>
									) : (
										''
									)}
									{data?.updateMe ? (
										<Alert className={classes.alert}>Changes saved</Alert>
									) : (
										''
									)}
								</Box>
								<TextField
									fullWidth
									label="Name"
									variant="outlined"
									value={name}
									onChange={onNameChange}
									className={classes.input}
								/>
								<Button
									disabled={loading}
									color="primary"
									variant="contained"
									component="label"
								>
									Upload PFP
									<input
										ref={fileInput}
										onChange={onFileChange}
										type="file"
										accept="image/jpeg,image/png,image/gif"
										hidden
									/>
								</Button>
							</Grid>
						</Grid>
					</CardContent>
					<CardActions>
						<Button color="primary" variant="contained" type="submit">
							Save
						</Button>
						<Button
							onClick={reset}
							color="primary"
							variant="contained"
							type="button"
						>
							Reset
						</Button>
						{loading && file ? (
							<Typography variant="body1">{Math.ceil(progress)}%</Typography>
						) : (
							''
						)}
					</CardActions>
				</form>
			</Card>
		</Box>
	)
}

export default EditProfile
