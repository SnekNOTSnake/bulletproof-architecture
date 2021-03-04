import { Container } from 'typedi'
import catchAsync from '../../../utils/catchAsync'
import AuthService from '../../../services/Auth'

const protect = catchAsync(async (req, res, next) => {
	const accessToken = req.headers['authorization']?.split(' ')[1]
	if (!accessToken) return next(new Error('You have to be logged in first'))

	const authServiceInstance = Container.get(AuthService)
	req.user = await authServiceInstance.protect(accessToken)

	next()
})

export default protect
