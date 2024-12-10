import TokenService from "../service/tokenService.js"
import ApiError from "../exceptions/apiErrors.js"

export default function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1]

    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const userData = TokenService.validateAccessToken(accessToken)

    if (!userData) {
      return next(ApiError.UnauthorizedError())
    }

    req.user = userData
    next()
  } catch(error) {
    return next(ApiError.UnauthorizedError())
  }
}