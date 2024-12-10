import {Model as User} from "sequelize"
import UserService from "../service/userService.js"
import TokenService from "../service/tokenService.js"

class UserController {
  async registration(req, res, next) {
    try {
      const {name, surName, number} = req.body

      const newName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      const newSurName = surName.charAt(0).toUpperCase() + surName.slice(1).toLowerCase()

      const userData = await UserService.registration(newName, newSurName, number)

      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      return res.json(userData)
    } catch(error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { number } = req.body
      const { refreshToken } = req.cookies

      // console.log(refreshToken)

      const userData = await UserService.login(number, refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      return res.json(userData)
    } catch(error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const token = UserService.logout(refreshToken)
      res.clearCookie('refreshToken')

      return res.json(token)
    } catch(error) {
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await UserService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      return res.json(userData)
    } catch(error) {
      next(error)
    }
  }

  async getUsers(req, res) {
    const users = await UserService.getUsers()

    return res.json(users)
  }
}

export default new UserController()