import TokenService from "../service/tokenService.js"

export default function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return next('Пользователь не авторизован')
    }

    const accessToken = authorizationHeader.split(' ')[1]

    if (!accessToken) {
      return next('Пользователь не авторизован')
    }

    const userData = TokenService.validateAccessToken(accessToken)

    if (!userData) {
      return next('Пользователь не авторизован')
    }

    req.user = userData
    next()
  } catch(error) {
    return next('Пользователь не авторизован')
  }
}