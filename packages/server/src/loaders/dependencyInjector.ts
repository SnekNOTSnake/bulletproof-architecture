import { Container } from 'typedi'
import { connect } from 'mongoose'

import Users from '../models/User'
import Books from '../models/Book'
import Reviews from '../models/Review'
import Follows from '../models/Follow'
import Notifs from '../models/Notif'

type Props = { mongoConnection: ThenArg<ReturnType<typeof connect>> }

const loadDI = async ({ mongoConnection }: Props) => {
	Container.set('usersModel', Users)
	Container.set('booksModel', Books)
	Container.set('reviewsModel', Reviews)
	Container.set('followsModel', Follows)
	Container.set('notifsModel', Notifs)
}

export default loadDI
