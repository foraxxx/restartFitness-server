import jwt from 'jsonwebtoken'
import {Tokens} from "../models/models.js"

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {expiresIn: '30m'})
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {expiresIn: '30d'})

    return {accessToken, refreshToken}
  }

  async saveToken(UserId, refreshToken, oldRefreshToken) {
    const userTokens = await Tokens.findAll({where: {UserId: UserId}})

    console.log(userTokens.length)

    if (userTokens.length > 0) {
      for (const token of userTokens) {
        if (token.refreshToken === oldRefreshToken) {
          token.refreshToken = refreshToken;
          return token.save()
        }
      }
    }

    const token = await Tokens.create({UserId, refreshToken})

    return token
  }

  async destroyToken(refreshToken) {
    const token = await Tokens.destroy({where: {refreshToken}})

    return token;
  }
}

export default new TokenService()