import { Container } from 'typedi'
import { connect } from 'mongoose'
import Users from '../models/Users'
import Books from '../models/Books'

type Props = { mongoConnection: ThenArg<ReturnType<typeof connect>> }

const loadDI = async ({ mongoConnection }: Props) => {
	Container.set('usersModel', Users)
	Container.set('booksModel', Books)
}

export default loadDI
