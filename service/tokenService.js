import jwt from 'jsonwebtoken'
import { Tokens } from "../models/models.js"

class TokenService {
  validateAccessToken(accessToken) {
    try {
      return jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY)
    } catch {
      return null
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)
    } catch {
      return null
    }
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '20m' })
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '14d' })
  }

  generateTokens(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    }
  }

  async saveToken(UserId, refreshToken, oldRefreshToken) {
    const userTokens = await Tokens.findAll({ where: { UserId } })

    if (userTokens.length > 0) {
      for (const token of userTokens) {
        if (token.refreshToken === oldRefreshToken) {
          token.refreshToken = refreshToken
          return token.save()
        }
      }
    }

    const token = await Tokens.create({ UserId, refreshToken })

    return token
  }

  async destroyToken(refreshToken) {
    return await Tokens.destroy({ where: { refreshToken } })
  }

  async findToken(refreshToken) {
    return await Tokens.findOne({ where: { refreshToken } })
  }


  // Новый метод — обновляет только access токен (без изменения refresh)
  async refreshAccessToken(oldAccessToken) {
    const userData = this.validateAccessToken(oldAccessToken)
    if (!userData) {
      throw new Error('Invalid access token')
    }

    const newAccessToken = this.generateAccessToken({ id: userData.id, number: userData.number, role: userData.role })
    return newAccessToken
  }

  // Метод для полного обновления токенов по refresh токену
  async refreshTokens(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw new Error('Refresh token not provided')
    }

    const userData = this.validateRefreshToken(oldRefreshToken)
    if (!userData) {
      throw new Error('Invalid refresh token')
    }

    const tokenInDb = await this.findToken(oldRefreshToken)
    if (!tokenInDb) {
      throw new Error('Refresh token not found in database')
    }

    const newTokens = this.generateTokens({ id: userData.id, number: userData.number, role: userData.role })
    await this.saveToken(userData.id, newTokens.refreshToken, oldRefreshToken)

    return newTokens
  }
}

export default new TokenService()
