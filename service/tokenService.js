import jwt from 'jsonwebtoken'
import {Tokens} from "../models/models.js"

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {expiresIn: '30m'})
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {expiresIn: '30d'})

    return {accessToken, refreshToken}
  }

  async saveToken(UserId, refreshToken) {
    const userTokens = await Tokens.findAll({where: {UserId}})

    if (userTokens.length > 0) {
      userTokens.forEach((token) => {
        if (token.refreshToken === refreshToken) {
          token.refreshToken = refreshToken
          return token.save()
        }
      })
    }

    const token = await Tokens.create({UserId, refreshToken})

    return token
  }
}

export default new TokenService()