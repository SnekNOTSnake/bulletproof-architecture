import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

import useStyles from './Search.style'

type InputChange = React.ChangeEvent<HTMLInputElement>

const Search: React.FC = () => {
	const [search, setSearch] = React.useState<string>('')

	const onChange = (e: InputChange) => setSearch(e.currentTarget.value)

	const classes = useStyles()

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card variant="outlined">
						<CardContent>
							<TextField
								className={classes.search}
								size="medium"
								value={search}
								onChange={onChange}
								variant="outlined"
								label="Search..."
								fullWidth
							/>

							<Box className={classes.results}>
								<Card className={classes.result} variant="outlined">
									<CardHeader
										title="Something cool"
										subheader="By someone, 6 hours ago"
									/>
									<CardContent>
										<Typography>
											Lorem ipsum dolor, sit amet consectetur adipisicing elit.
											Consectetur recusandae dolorum, quibusdam natus iusto
											eaque fuga est autem.
										</Typography>
									</CardContent>
								</Card>
								<Card className={classes.result} variant="outlined">
									<CardHeader
										title="Something cool"
										subheader="By someone, 6 hours ago"
									/>
									<CardContent>
										<Typography>
											Lorem ipsum dolor, sit amet consectetur adipisicing elit.
											Consectetur recusandae dolorum, quibusdam natus iusto
											eaque fuga est autem.
										</Typography>
									</CardContent>
								</Card>
							</Box>

							<Button
								className={classes.more}
								color="primary"
								variant="contained"
								disableElevation
							>
								More
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Search
