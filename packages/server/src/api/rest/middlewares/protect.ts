import { Container } from 'typedi'

import AppError from '../../../utils/AppError'
import catchAsync from '../../../utils/catchAsync'
import AuthService from '../../../services/Auth'

const protect = catchAsync(async (req, res, next) => {
	const accessToken = req.headers['authorization']?.split(' ')[1]
	if (!accessToken)
		return next(new AppError('You have to be logged in first', 401))

	const authServiceInstance = Container.get(AuthService)
	req.user = await authServiceInstance.protect(accessToken)

	next()
})

export default protect
