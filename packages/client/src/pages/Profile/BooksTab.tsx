import React from 'react'
import { useSnackbar } from 'notistack'

import { Box, Button, Typography } from '@material-ui/core'

import { useBooksQuery } from '../../generated/types'
import SimpleBook from '../../components/SimpleBook'

type Props = { userId: string }

const BooksTab: React.FC<Props> = ({ userId }) => {
	const { enqueueSnackbar } = useSnackbar()

	const { data, loading, fetchMore } = useBooksQuery({
		variables: { first: 1, where: { author: userId } },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	if (loading)
		return (
			<Box p={3}>
				<Typography>Loading data...</Typography>
			</Box>
		)

	return (
		<Box p={3}>
			<Box>
				{data?.books.nodes.map((book) => (
					<SimpleBook key={book.id} book={book} />
				))}
			</Box>

			{data?.books.pageInfo.hasNextPage ? (
				<Button
					color="primary"
					variant="contained"
					disableElevation
					onClick={() =>
						fetchMore({
							variables: {
								first: 1,
								after: data.books.pageInfo.endCursor,
								where: { author: userId },
							},
						})
					}
				>
					More
				</Button>
			) : (
				''
			)}
		</Box>
	)
}

export default BooksTab
